# 优化网站中的图片和视频

优化网站中的图片和视频主要围绕着两方面进行，一方面减少文件大小，另一方面是延迟加载非关键图片或视频资源

## 高分辨率屏幕的含义

有两种不同的像素: CSS 像素和设备像素，单个 CSS 像素可以直接对应单个设备像素，也可能对应多个设备像素，设备像素越多，屏幕上显示内容的细节就越精细。

![](https://web-dev.imgix.net/image/admin/oQV7qJ9fUMkYsKlUMrL4.png?auto=format&w=940)

我们通常说位图在高 DPI 屏幕能产生更好看的效果，但是这需要图像有高分辨率以利用更高的设备像素计数，矢量图在任何分辨率下渲染的效果都是相同的。位图按像素对图像数据进行编码，因此，像素数越多，位图的文件就越大，提高位图的分辨率和增加位图的尺寸都会导致像素数增加

![](./img/fileSize.png)

当我们将物理屏幕的分辨率提高一倍时，总像素数将增加四倍，这是因为水平像素数增加一倍，垂直像素数增加一倍。因此，“2x”屏幕所需要的像素数是“1x”屏幕的四倍!

## 位图和矢量图

![](https://web-dev.imgix.net/image/admin/dJuB2DQcbhtwD5VdPVlR.png?auto=format&w=1170)

有两种类型的图片，分别是位图和矢量图。矢量图使用线、点和多边形来表示图像，位图使用像素阵列来表示图像。

矢量图非常适合用于 logo、文本或 icon 等简单几何形状组成的图像，矢量图在各种分辨率和缩放等级下都能提供清晰的显示效果，然而，当图像比较复杂时，例如，一张照片，矢量图就显得不够用了，为了描述图片上的所有形状，需要用到的 SVG 标记的数量可能会高得令人望而却步，而且输出的效果可能仍然看起来不逼真，在这种情况下，就应该使用位图。

位图非常适合用于色彩变化丰富，复杂的图像，但它不具备与分辨率或缩放无关的良好特性，当你放大位图时，你会看到锯齿状和模糊的图形

## 优化矢量图

所有现代浏览器都支持矢量图形(Scalable Vector Graphics, SVG)，这是一种基于 xml 的图像格式。

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px" y="0px" viewBox="0 0 612 792" xml:space="preserve">
<g id="XMLID_1_">
  <g>
    <circle fill="red" stroke="black" stroke-width="2" stroke-miterlimit="10" cx="50" cy="50" r="40"/>
  </g>
</g>
</svg>
```

上面的例子中包含大量元数据，如注释和XML名称空间，这些对浏览器呈现图像不产生影响。因此，去掉空格和备注是优化矢量图的有效手段，另外 SVG 是一种基于xml的格式，所以还可以使用 GZIP 压缩来减少它的传输大小

## 位图

根据位深度，可将位图分为1、4、8、16、24及32位图像等，每个像素使用的信息位数越多，可用的颜色就越多，颜色表现就越逼真，相应的文件越大。RGB 图像由三个颜色通道组成，8 位/通道的 RGB 图像中的每个通道有 256(2 ^ 8 = 256) 个可能的值，这意味着该图像可以表示 16,777,216(256 ^ 3)种颜色。有时将带有 8 位/通道 (bpc) 的 RGB 图像称作 24 位图像（8 位 x 3 通道 = 24 位数据/像素）

知道图像的位深度和像素数，我们可以计算出图像文件的大小

10000像素  x 3 字节 = 30000 字节，30000 字节 / 1024 = 29 KB

减小位图文件大小一个简单的策略是减小图像的位深度，例如将 RGB 图像从 24 位图像(一个像素占3个字节)变成 8 位图像(一个像素占1字节)，这会使文件减少 2/3

### 位图的格式

PNG、JPEG、WebP 都是不同的位图格式，PNG 和 JPEG 得到了浏览器广泛的尺寸，现代浏览器支持 WebP，WebP 图像比 JPEG 和 PNG 图像要小，通常在文件大小上减少25-35%，这将减少网站负载，WebP 是 JPEG、PNG 和 GIF 图像的绝佳替代品。下面是 PNG、JPEG、WebP 的特性

![](./img/format.png)

WebP 和 JPEG 都提供无损压缩和有损压缩，在无损压缩中不丢失数据，有损压缩减少文件大小，但可能会降低图像质量。如果你的图像需要更多的细节那么使用 PNG，PNG 不应用任何有损压缩算法，因此它将产生最高质量的图像，但文件大小比其他格式高得多。

GIF 可以用来表示动画并且得到浏览器的广泛支持，但是不推荐使用它，因为 gif 动画文件非常大，在不能使用 WebP 的情况下，你可以使用 video 代替动画

### 压缩图像

可以使用 Imagemin 对图像进行压缩，它支持多种图像格式并且很容易与构建工具集成，Imagemin 可以作为 CLI 和 npm 模块使用，它是围绕插件的

![](./img/imagemin.png)

Imagemin CLI

使用如下命令压缩“images/”目录下的镜像文件并保存到同一目录下(覆盖原有文件):

```vstscli
 imagemin images/* --out-dir=images
```

Imagemin node 模块

可以将 Imagemin 与 webpack、gulp 或 grunt 配合使用，还可以单独使用 Imagemin，这段代码使用 imagemin-mozjpeg 插件将 JPEG 文件压缩到50的质量(“0”是最差的;“100”是最好的):

```javascript
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');

(async() => {
  const files = await imagemin(
      ['source_dir/*.jpg', 'another_dir/*.jpg'],
      {
        destination: 'destination_dir',
        plugins: [imageminMozjpeg({quality: 50})]
      }
  );
  console.log(files);
})();
```

### 将图像转成 WebP 格式

可以使用 [cwebp command-line tool](https://developers.google.com/speed/webp/docs/using) 或 [Imagemin WebP 插件](https://github.com/imagemin/imagemin-webp) 将图像转换为 WebP，如果你的项目使用了构建工具(例如 Webpack 或 Gulp )那么 Imagemin WebP 插件可能是最好的选择，而如果你只需要转换一次图像你可以使用 CLI

使用 cwebp

转换单个文件，使用 cwebp 的默认压缩设置:

```dotnetcli
cwebp images/flower.jpg -o images/flower.webp
```

使用 Imagemin webp 插件

在前面压缩文件时，我们就用到了 Imagemin，现在我们依然使用 Imagemin，但是用到的插件不一样，下面的脚本将转换 images 目录中的文件，并将它们保存在 compressed_images 目录中。

```javascript
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

imagemin(['images/*'], {
  destination: 'compressed_images',
  plugins: [imageminWebp({quality: 50})]
}).then(() => {
  console.log('Done!');
});
```

### 使用 WEbP 图片

Before:

```html
<img src="flower.jpg" alt="">
```

After:

```html
<picture>
  <source type="image/webp" srcset="flower.webp">
  <source type="image/jpeg" srcset="flower.jpg">
  <img src="flower.jpg" alt="">
</picture>
```

浏览器会从上到下检查它支持哪一种格式的图片，如果浏览器不支持 source 标签中列出的任何格式，它将退回到加载 img 标记指定的图像。

### 将 gif 动画替换为视频，以更快的页面加载

创建 MPEG 视频

有许多方法可以将 gif 转换为视频，FFmpeg 是其中之一， 在控制台中运行以下命令将 GIF 转成 mp4

```vstscli
ffmpeg -i my-animation.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

ibx264 编码器只适用于大小为偶数的文件，比如 320px * 240px。如果输入的 GIF 的大小时奇数，你可以在命令中包括一个 filter，以避免 FFmpeg 抛出错误:

```vstscli
ffmpeg -i my-animation.gif -vf "crop=trunc(iw/2)*2:trunc(ih/2)*2" -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p my-animation.mp4
```

创建 WebM 视频

MP4 从 1999 年就出现了，WebM 是一种相对较新的文件格式，最初发布于2010年。WebM 视频比 MP4 视频小得多，但并不是所有浏览器都支持 WebM

要使用 FFmpeg 将 my-animation.gif 转换为 WebM 视频，在控制台中运行以下命令:

```vstscli
ffmpeg -i my-animation.gif -c vp9 -b:v 0 -crf 41 my-animation.webm
```

![](https://web-dev.imgix.net/image/admin/LWzvOWaOdMnNLTPWjayt.png?auto=format&w=1600)

在这个例子中，最初的 GIF 是 3.7 MB，而 MP4 版本是 551 KB, WebM 版本只有 341 KB

### 在 HTML 中使用视频替换 GIF

```HTML
<video autoplay loop muted playsinline>
  <source src="my-animation.webm" type="video/webm">
  <source src="my-animation.mp4" type="video/mp4">
</video>
```

浏览器不会猜测哪个视频资源是最优的，所以源代码的顺序很重要。例如，如果你先指定一个MP4视频，而浏览器支持WebM，浏览器将跳过 WebM 而使用 MPEG4，如果你想先使用WebM ，要先指定它

### 使用响应式图片

使用响应式图片可以让浏览器在不同的设备像素密度或者不同的视口宽度加载不同的图像资源，这对网站的性能与用户体验都是极好的

指定多个图像版本，浏览器将选择最合适的尺寸展示给用户:

![](./img/resizeImage.png)

src 属性使得这段代码可以在不支持 srcset 和 sizes 属性的浏览器中工作。如果浏览器不支持这些属性，它将退回到加载 src 属性指定的资源，所以 src 属性指定的资源应该足够大，足以在所有设备上正常工作。

srcset 属性是一个以逗号分隔的图像文件名及其宽度或密度描述符的列表。使用 w 单位(而不是px)来编写宽度描述符，例如：1024px 宽的图像会被写成 1024w，使用 x 单位来编写密度描述符。这个例子使用了宽度描述符。480w 是一个宽度描述符，它告诉浏览器 flower-small.jpg 的宽度是 480px；1080w 是一个宽度描述符，它告诉浏览器 flower-large.jpg 的宽度是 1080px

sizes 属性告诉浏览器图像显示时的宽度，然而，sizes 属性对图像的显示大小没有影响，你仍然需要 CSS。sizes 可以使用多种单位指定，以下是所有有效的大小:

* 100px
* 33vw
* 20em
* calc(50vw-10px)

以下不是有效的大小

20% （sizes属性不能使用百分比）

如果想要更花哨，还可以使用 sizes 属性指定多个插槽大小，这适用于不同视口大小使用不同布局的网站。

```html
<img src="flower.jpg"
  srcset="flower-small.jpg 480w, flower-large.jpg 800w"
  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 800px">
```

sizes 属性的值告诉浏览器：图片在不超过 480px 宽的视口中显示宽度为视口宽度的100%，图片在 481-1024px 宽的视口上显示宽度为视口宽度的 50%，图片在 1024px 宽的屏幕上显示宽度为 800px，这些宽度要与 CSS 中指定的宽度相匹配

## 延迟加载图片

将图片显示在网页中有两种方式，一种是 img 标签内联图像，另一种是将图像作为背景。

### 延迟加载内联图像

对于内联图像，我们有三种延迟加载的选项，可以组合使用，以获得最佳的浏览器兼容性:

1. 使用 loading="lazy"
2. 使用 Intersection Observer API
3. 使用 scroll 和 resize 事件处理程序

#### loading="lazy"

Chrome 和 Firefox 都通过 loading 属性支持延迟加载。这个属性可以添加到 img 元素，也可以添加到 iframe 元素。loading="lazy" 告诉浏览器，如果图像在视口中，就立即加载它,如果浏览器不支持 loading="lazy"，那么该属性将被忽略，图像将像往常一样立即加载。

```html
<img 
    src='path/to/img' 
    loading="lazy"
/>
```

#### Intersection Observer API

为了 polyfill img 元素 loading="lazy" 的延迟加载，我们使用 Intersection Observer API 来检查它们是否在视口中，如果答案是，它们的 src 属性将使用图像的 url 填充。并不是所有的浏览器都支持 Intersection Observer，尤其是 IE11及以下，如果跨浏览器的兼容性非常重要，请务必阅读下一节，下一节将介绍如何使用性能较差但更兼容的滚动和调整事件处理程序延迟加载图像。

与依赖于各种事件处理程序的代码相比，Intersection Observer 更简洁，因为您只需要注册一个观察者来监视元素，而不需要编写冗长的元素可见性检测代码，剩下要做的就是决定当元素可见时该做什么。我们假设延迟加载的 img 元素有以下基本标记模式:

```html
<img class="lazy" src="placeholder-image.jpg" data-src="image-to-lazy-load-1x.jpg" data-srcset="image-to-lazy-load-2x.jpg 2x, image-to-lazy-load-1x.jpg 1x" alt="I'm an image!">
```

您应该关注 img 标记的三个相关部分:

1. class 属性，在JavaScript中您将使用它选择元素。
2. src 属性，它引用在页面首次加载时出现的占位符图像。
3. data-src 和 data-srcset 属性，它们是占位符属性，包含元素进入视区后将加载的图像的 URL。

现在让我们看看如何在 JavaScript 中使用 Intersection Observer 来延迟加载图像:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});
```

在文档的 DOMContentLoaded 事件上，该脚本使用 class 查询 DOM 中所有的 lazy 元素。如果 IntersectionObserver 是可用的，就创建一个新的观察者运行一个回调

#### 使用事件处理程序支持 Internet Explorer

使用scroll, resize 以及可能的 orientationchange 事件处理程序与 getBoundingClientRect 一起来确定一个元素是否在视区，假设 HTML 代码与之前相同

```javascript
document.addEventListener("DOMContentLoaded", function() {
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
  let active = false;

  const lazyLoad = function() {
    if (active === false) {
      active = true;

      setTimeout(function() {
        lazyImages.forEach(function(lazyImage) {
          if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.srcset = lazyImage.dataset.srcset;
            lazyImage.classList.remove("lazy");

            lazyImages = lazyImages.filter(function(image) {
              return image !== lazyImage;
            });

            if (lazyImages.length === 0) {
              document.removeEventListener("scroll", lazyLoad);
              window.removeEventListener("resize", lazyLoad);
              window.removeEventListener("orientationchange", lazyLoad);
            }
          }
        });

        active = false;
      }, 200);
    }
  };

  document.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
});
```

虽然这段代码几乎在所有浏览器中都可以工作，但它有潜在的性能问题。尽可能使用 loading="lazy" + Intersection Observer 实现延迟加载，并且只有在最广泛的兼容性是应用程序的关键需求时才使用事件处理程序实现延迟加载

### 图片在 CSS 中

虽然 img 标签是在网页上使用图像最常见的方式，图像也可以通过 CSS background-image 属性调用。loading="lazy" 的延迟加载不适用于 CSS 背景图像，因此，如果需要延迟加载背景图像，则需要考虑其他方法。

与 img 元素加载图片时不考虑其可见性不同，在构建 Document 和 CSS 对象模型以及 render 树之后，浏览器在请求外部资源之前会检查 CSS 是如何应用到文档的。如果浏览器已经确定涉及到的外部资源的 CSS 规则没有应用到当前构造的 document，则浏览器不会请求它。这种行为可以用来延迟 CSS 中图像的加载，方法是使用 JavaScript 来确定某个元素何时在视口中，然后对该元素添加一个 class 来应用样式加载背景图像，这将导致在需要的时候下载图像，而不是在初始加载时。例如，让我们下面的代码为例:

```html
<div class="lazy-background">
  <h1>Here's a hero heading to get your attention!</h1>
  <p>Here's hero copy to convince you to buy a thing!</p>
  <a href="/buy-a-thing">Buy a thing!</a>
</div>
```

```css
.lazy-background {
  background-image: url("hero-placeholder.jpg"); /* Placeholder image */
}

.lazy-background.visible {
  background-image: url("hero.jpg"); /* The final image */
}
```

在 JavaScript 中使用 Intersection Observer 来检查元素是否在视口中，然后将 visible 类添加到 div.lazy-background 元素中:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyBackgrounds = [].slice.call(document.querySelectorAll(".lazy-background"));

  if ("IntersectionObserver" in window) {
    let lazyBackgroundObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          lazyBackgroundObserver.unobserve(entry.target);
        }
      });
    });

    lazyBackgrounds.forEach(function(lazyBackground) {
      lazyBackgroundObserver.observe(lazyBackground);
    });
  }
});
```

这里有一些延迟加载的开源库

1. [lazysizes](https://github.com/aFarkas/lazysizes)
2. [vanilla-lazyload](https://github.com/verlok/vanilla-lazyload)
3. [lozad.js](https://github.com/ApoorvSaxena/lozad.js)
4. [yall.js](https://github.com/malchata/yall.js)
5. [react-lazyload](https://github.com/twobin/react-lazyload)

## 延迟加载视频

与图像元素一样，您也可以延迟加载视频。视频通常使用 video 元素加载。但是，如何延迟加载视频取决于视频的使用场景。这里我们讨论两个场景，每个场景都需要不同的解决方案

### 延迟加载不需要自动播放的视频

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

上面的例子使用了一个 preload 属性，值为 none，以防止浏览器预加载任何视频数据。poster 属性为 video 元素提供了一个占位符，该占位符将在视频加载时占据空间。

### 延迟加载用视频替换的 gif 动画

虽然 gif 动画得到了广泛的使用，但它们在许多方面都不及视频，尤其是在文件大小上。使用 video 元素替换 GIF 动画不像使用 img 元素那么简单。gif动画有三个特点:

1. 自动播放
2. 循环播放
3. 静默播放

使用 video 元素实现这个效果如下所示:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

如何进行延迟加载用视频替换的 gif 动画，修改 HTML 如下：

```html
<video class="lazy" autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

我修改了 source 中的 src 和 data-src，然后使用与 Intersection observer 的图像延迟加载示例类似的 JavaScript 代码:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

当延迟加载视频元素时，需要遍历所有 source 元素，并将它们的 data-src 属性转换为 src 属性，然后你需要调用 video 的 load 方法来触发视频的加载，之后媒体将根据 autopla属性自动播放视频

## 总结

优化网站中的图片和视频有如下的策略：

1. 尽量使用矢量图：矢量图像的显示效果与分辨率无关，这使它们非常适合用于多设备和高分辨率
2. 缩小和压缩 SVG 资产：大多数绘图应用程序生成的 XML 标记通常包含可以删除的不必要的元数据，确保您的服务器配置为对 SVG 资产应用 GZIP 压缩。
3. 在使用位图时尽量使用 WebP 格式：WebP图像通常比旧的格式图像小得多。
4. 压缩位图：不要害怕降低质量，结果通常非常好，而且文件大小下降是显著的。
5. 删除不必要的图像元数据：许多位图中包含关于图片的不必要的元数据，如：地理信息、相机信息
6. 使用响应图片：让浏览器在不同的设备像素密度或者不同的视口宽度加载不同的图像资源
7. 用视频代替 gif：gif 的文件太大并且效果也不好
8. 延迟加载图片和视频：减小网站的初始负载，让用户加载他们需要看到的图片和视频
9. 将图片放在 CND 上