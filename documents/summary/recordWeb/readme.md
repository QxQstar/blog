# 前端录制回放

前端录制回放指的是录制用户在网页中的各种操作并支持回放，文本介绍的录制回放基于开源项目 rrweb 实现。

## 名词解释

* 全量快照：深度优先遍历整个 Document，生成一个类似于 dom 树的数据结构，这个数据称为全量快照。
* 增量快照：在完成一次全量快照之后，基于当前视图状态观察所有可能对视图造成改动的情形，此时产生的数据生成增量快照。

## Todo & Not Todo

### Todo

本文将介绍如下 4 个方面的内容：

* 实现网页录制用到的 DOM API
* 减小数据体积的策略
* 数据的存储策略

涉及的知识点有 DOM API、Web Workers、IndexedDB 和 Gzip 压缩。

### Not Todo

本文不介绍 rrweb 提供的 API，到 [rrweb 的仓库](https://github.com/rrweb-io/rrweb)可查看 rrweb 的教程。

## 实现网页录制用到的 DOM API

rrweb 可观察 DOM 变动、canvas 画布的变动、鼠标移动、鼠标交互、页面或元素滚动、视窗大小改变和输入等，为了观察这些事件，它使用了多个 DOM API，下面分别介绍它们。

### 观察 DOM 变动

观察 DOM 变更用到的 API 是 MutationObserver，它的用法如下：

```javascript
// 当观察到变动时，执行这个回调函数
const callback = (mutationList, observer) => {
    mutationList.forEach((mutation) => {
        if (mutation.type === 'characterData') {
        } else if (mutation.type === 'attributes') {
        } else if (mutation.type === 'childList') {
        }
    })
}

// 创建一个观察者
const observer = new MutationObserver(callback);

// 开始观察目标节点
observer.observe(targetNode, {
    // 观察目标节点的子树
    subtree: true,
    // 观察目标节点的 childList,插入或者移除 child
    childList: true,
    // 观察属性值的变化
    attributes: true,
    // 观察哪些属性值的变化，如果 attributeFilter 为 undefined，那么所有属性都会被观察
   attributeFilter: ['class'],
    // 记录属性改变之前的值
   attributeOldValue: true,
   // 观察文本的变化
   characterData: true,
   // 记录文本变化之前的值
   characterDataOldValue: true
});

observer.disconnect();
```

### canvas 画布的变动

有两种方式观察 canvas 画布的变动，一种是将 canvas 2D 上下文和 webgl 上下文的 API 包裹一层，记录调用的方法和参数，另一种是定期给 canvas 生成一张二进制位图，保存这张截图。

包裹 canvas 2D 上下文和 webgl 上下文的 API，以 webgl 上下文的 API 为例：

```typescript
function patchGLPrototype(
    prototype: WebGLRenderingContext | WebGL2RenderingContext,
    type: CanvasContext,
    cb: canvasManagerMutationCallback
): listenerHandler[] {
    const props = Object.getOwnPropertyNames(prototype);

    for (const prop of props) {
        const original = source[name] as () => unknown;
        // 重写方法
        source[name] = (...args: unknown[]) {
            original.apply(this, args)
            const recordArgs = serializeArgs([...args], window, prototype);
            const mutation: canvasMutationWithType = {
                type,
                p: prop,
                a: recordArgs,
            };
            // 记录导致画布发生变化的参数和方法
            cb(this.canvas, mutation);
        }
    }
}

patchGLPrototype(WebGLRenderingContext.prototype, CanvasContext.WebGL, cb)
patchGLPrototype(WebGL2RenderingContext.prototype, CanvasContext.WebGL2, cb)
```

用重写原始方法的方式观察 canvas 画布的变动会导致 FPS 有明显的下降，但是产生的数据体积较小。定期给 canvas 生成一张二进制位图，保存截图，回放的时候将图片画在 canvas 画布上，这种方式产生的数据体积较大，但不会导致 FPS 有明显下降，用到的 web API 有 Web Workers（在后文单独介绍）、requestAnimationFrame、createImageBitmap 和 OffscreenCanvas。

* requestAnimationFrame(callback)

让浏览器在下一次重新绘制之前调用指定函数，用它来计算上一次生成截图到现在的时间间隔，如果间隔小于指定时间不生成截图。

* createImageBitmap

用它以给定的 canvas 生成二进制位图，用法如下：

```javascript
const bitmap = 
    await createImageBitmap(canvas,sx,sy,sw,sh, {
        // 二进制位图的宽度
        resizeWidth: 100,
        // 二进制位图的高度
        resizeHeight: 100,
        // 图片原样显示还是沿 Y 轴翻转
        imageOrientation: 'none',
        // 位图的颜色通道是否应被alpha通道预乘
        premultiplyAlpha: 'default',
        // 是否应使用颜色空间转换对图像进行解码,
        colorSpaceConversion: 'default',
        // 调整位图的输出质量
        resizeQuality: 'low'
    });
```

* OffscreenCanvas

创建一个离屏渲染的 canvas 将上一步的二进制位图画在画布上，生成 blob ，最终生成 base64，在这一步还需要生成一张透明的图，去判断 base64 对应的图是否是透明图，如果是则不保存数据。示例代码如下：

```typescript
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d')!;

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await offscreen.convertToBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = encode(arrayBuffer);

   function getTransparentBlobFor(width: number, height: number): Promise<string> {
    const offscreen = new OffscreenCanvas(width, height);
    offscreen.getContext('2d'); 
    const blob = await offscreen.convertToBlob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = encode(arrayBuffer); // cpu intensive     
    return base64;
  }  
  // 判断是否透明图
  if (base64 !== await getTransparentBlobFor(width, height)) {
    // do something
  }
```

offscreen.convertToBlob 在创建 blob 时，能指定文件的格式和图片质量，默认导出 image/png 格式的数据，可选的格式还有 image/jpeg 和 image/webp。

### 鼠标移动

给 document 绑定 mousemove、touchmove 和 drag 事件，在事件处理程序中获取鼠标的位置。

### 鼠标交互

给 document 绑定 mouseup、mousedown、click、contextmenu、dblclick、focus、blur、touchstart、touchend、touchcancel 事件，在事件处理程序中得到鼠标的位置。

> 通过 event.composedPath() 能获取事件的触发路径，它返回一个包含触发事件的 dom 节点数组，第一个位置是事件的 target。JSX 语法绑定事件在event对象上没有这个方法。

### 页面或元素滚动

给 document 绑定 scroll 事件，在事件处理程序中获取 target 的 scrollLeft 和 scrollTop。

### 视窗大小改变

给 window 绑定 resize 事件，在事件处理程序中获取视口的宽高。

### 输入

利用事件冒泡的特性，给 document 绑定 change 事件或者绑定 change 事件和 input 事件，在事件处理程序中判断 target 是否是 input、textarea 或者 select，如果是，则统计 target 的 value 和 checked 属性值，否则返回。

为了观察输入值的变化，还会获取 HTMLInputElement.prototype.value 的属性描述符，如果它有 setter 则将它的 setter 包裹一层，除此之外还有 HTMLInputElement.prototype.checked、HTMLSelectElement.prototype.value、HTMLTextAreaElement.prototype.value、HTMLSelectElement.prototype.selectedIndex 和 HTMLOptionElement.prototype.selected，以 HTMLInputElement.prototype.value 为例，示例代码如下：

```javascript
const propertyDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

if (propertyDescriptor && propertyDescriptor.set) {
    Object.defineProperty(HTMLInputElement.prototype, 'value', {
        set(value) {
            propertyDescriptor.set.call(this, value)
            eventHandler({target: this})
        }
    })
}
```

### 多媒体交互

给 document 绑定 play、pause、seeked 和 volumechange 事件（这些事件都不支持冒泡，所以可能有 bug，但没有实际测试过），在事件处理程序中获取 target 的音量和播放进度。

### CSS 样式变动

观察 CSS 样式的变动，涉及到 CSSStyleSheet、CSSStyleDeclaration、CSSGroupingRule、这两个对象，采用的方式是将原始方法包一层，方法有：CSSStyleDeclaration.prototype.setProperty、CSSStyleSheet.prototype.insertRule 和 CSSStyleSheet.prototype.deleteRule。

### 网页字体的变动

将 window.FontFace 和 document.fonts.add 包裹一层。

## 减小数据体积的策略

从提取冗余数据、减小 canvas 截图的大小和 Gzip 压缩这三个方面减小数据的体积。

### 提取的冗余数据

要提取的冗余数据有 className、style 内联样式和 style 嵌入样式，提取出的冗余数据与录制数据单独保存，并且在每个用户间共用。如下是一条录制数据示例：

./img/record_data.png)

提取之后上图的 class 属性值将变成 '0 1', style 属性值将变成 '0;1;2',另外会新增两个对象，分别是 classNameMap 和 styleMap，它们的的值如下：

```javascript
const classNameMap = {
 'tui-collapse-panel': '0',
 'tui-collapse-panel-active': '1'
}

const styleMap = {
 'pointer-events: auto': '0',
 'opacity: 1': '1',
 'cursor: default': '2'
}
```

style 嵌入样式也按照类似的方式提取，但是保存的数据结构不同，接口如下：

```typescript
type cssTexts = Array<{
 // 这是 style 标签中的样式规则
 textContent: string,
 uid: string
}>
```

### 减小 canvas 截图的大小

两个策略，一个是用 createImageBitmap 生成二进制位图的时候，将输出图片的宽高设置成 canvas 宽高的 1/2（这个比例可以由使用方决定），另一个是用 OffscreenCanvas.convertToBlob 创建 blob 对象时，输出 webp 格式的图片，并且将图片的质量设置为 0.5。代码如下：

```javascript
const bitmap = await createImageBitmap(canvas, {
    resizeWidth: imgW,
    resizeHeight: imgH,
});
const offscreen = new OffscreenCanvas(imgW, imgW);
const ctx = offscreen.getContext('2d')!;

ctx.drawImage(bitmap, 0, 0);
bitmap.close();
const blob = await OffscreenCanvas.convertToBlob({
 type: 'image/webp',
 quality: 0.5
})
const arrayBuffer = await blob.arrayBuffer();
const base64 = encode(arrayBuffer);
```

### GZip 压缩

录制数据是一个可序列化的对象，要想进行 GZip 压缩必须将它序列化成字符串，用 JSON.stringify 序列化大对象时，可能导致浏览器崩溃，然而全量快照的大小取决于 dom 树的嵌套层级，业务方的 dom 树究竟嵌套了多少层，前端录制回放工具对此不可知，所以不能用 JSON.stringify 直接序列化所有类型的录制数据。最终得出如下3条序列化规则：

1. 拥有 childNodes 嵌套层级的对象采用分层序列化。全量快照和由 MutationObserver 产生的，并且用 add 字段的增量快照属于这一类。
2. 没有 childNodes 的对象直接用 JSON.stringify 将其整体序列化为字符串。
3. 有 childNodes 但可预知嵌套层级较小的标签，比如 head，style 直接用 JSON.stringify 将对象整体序列化为字符串。

使用上述规则之后，序列化全量快照的结果如下：

./img/seriz.png)

用 fflate 实现 GZip 压缩，将多个录制数据批量压缩，对于 GZip 等压缩算法来说更为友好，但是对拥有 childNodes 嵌套层级的对象不进行批量压缩。代码如下：

```javascript
const stringifyDataArr = events.map(event => JSON.stringify(event))

// GZip 压缩
compress(`[${stringifyDataArr.join(',')}]`)
```

之所以不用 JSON.stringify(events) 是为了防止 events 太大导致浏览器崩溃。

> 为了不阻塞主线程，减小数据体积相关的操作在 worker 线程中进行， 后面将介绍 Web Worker。

## 数据的存储策略

录制数据使用 IndexedDB API 保存在用户本地。前面提取的冗余数据保存到单独的数据库中，该数据库名固定，它有三个 table，分别是 classNameMap、styleMap 和 cssTexts，录制数据存储在哪个数据库由业务方使用录制工具时传入。

IndexedDB 存储数据时要对数据进行结构克隆，因此不支持[结构克隆算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)的数据不能被 IndexedDB 存储，比如：函数、DOM 节点 等，能被 IndexedDB 的数据类型有除 symbol 之外的基本类型、Blob、ArrayBuffer 和 File 等。IndexedDB API 在 Web Worker 中可用。

存储在客户端的数据有两类，分别是持久的和临时的。持久存储要让用户授权；临时存储不需要授权，当达到存储限制时，根据 LRU 策略（最近最少使用）将数据清除，IndexedDB 默认采用临时存储。

浏览器最大存储空间是磁盘剩余空间的 50%，这种限制被称为 global 限制，当限制达到时，origin eviction 程序将会运行，它以 LRU 策略删除整个 origin 的全部数据，直到浏览器存储的数据量低于限制。还有一种限制是 group 限制，每个 group 能分配 global 20% 的存储空间，至少 10M 最大 2G，但不能超过 global 限制。每个 origin 都是某 group 的一部分，如下：

* mozilla.org — group1, origin1
* www.mozilla.org — group1, origin2
* joe.blogs.mozilla.org — group1, origin3
* firefox.com — group2, origin4 

上述 mozilla.org、www.mozilla.org 和 joe.blogs.mozilla.org 是同一个 group，它们总共最多可以使用 global 限制的 20%，firefox.com 是单独的 group，它独占 global 限制的 20%。

group 限制是硬限制，不会触发 origin eviction 程序，global 限制是软限制，会触发 origin eviction 程序，当以 LRU 策略释放一些空间之后，数据存储操作还能继续。如果超出了 group 限制，或者 origin eviction 无法释放足够的空间时，浏览器将抛出 QuotaExceededError。

> 录制工具将 IndexedDB 数据库相关的操作放在 Web Worker 中。

## Web Worker

Web Worker 常用于处理耗时任务，worker 线程中的计算不阻塞主线程，但它与主线程共用 CPU 资源，而且与主线程通信会影响到主线程的性能。

### 传递数据

worker 实例通过 onmessage 接收消息，通过 postMessage 发送消息。主线程与 worker 传递的数据默认要进行[结构克隆](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)，对象在传递给 worker 时被序列化，随后在另一端反序列化，当传递的对象非常庞大时，会消耗大量计算资源，降低运行速度。Chrome 17+, Firefox, Opera, Safari, IE10+ 在传递 ArrayBuffer 时有一种名为[对象转移](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects)的方式传递数据，对象转移是指将对象引用零成本转交给 worker 的上下文，而不需要进行结构克隆，对象引用转移后，原先上下文就无法访问此对象了。代码如下：

```javascript
var buffer = new ArrayBuffer(1);
worker.postMessage(buffer, [buffer]);

worker.postMessage({
    id: 1,
    buffer
}, [buffer]);
```

> 结构克隆调用的方法是 structuredClone

### 任务队列

在主线程与 worker 线程之后手动维护一个任务队列，如果前面的 postMessage 还没来得及消费，就不发送新的消息，即便发送了，也没有意义，当排队的任务太多，可能导致 worker 线程卡住，此时除了销毁 worker没有别的办法。