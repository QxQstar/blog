# Code Review
## Code Review的好处
1. 知识共享。高手指出新手代码中的问题，新手从高手的反馈中学习到更好的实践，得到更快的成长。高手可以提高自己的沟通能力，发现问题的能力，并帮助新手成长。
2. 提高代码质量。提高代码的可维护性和可读性，优化代码结构，减少特定条件才触发的死循环，减少一些安全上的漏洞。
3. 保证团队规范的执行。

## 什么时候做Code Review
代码合并到主干分支之前

## 开发人员如何提高自己代码的质量
1. 先设计后编码
> 在写新功能之前，先写简单的设计文档
2. 在提交Code Review之前自己先review和测试一遍
> 在提交PR时，在PR的描述中添加截屏或录屏，确保提交PR的人自己是先测试过的。

## 如何做Code Review
1. PR要小
> 在提交PR时，PR要小，如果是比较大的改动，最好分批提交，以减轻审阅者的压力。

2. 聚合相关的变更
> 每一次提交PR都应该是单一目的的代码变更
2. 对评论进行分级
> 对Review的评论进行分级，不同级别的结果可以打上不同的Tag.评论要友好，避免负面词汇；有说不清楚的问题当面沟通

* [blocker]： 在评论前面加上一个[blocker]标记，表示这个代码行的问题必须要修改
* [optional]：在评论前面加上一个[optional]标记，表示这个代码行的问题可改可不改
* [question]：在评论前面加上一个[question]标记，表示对这个代码行不理解，有问题需要问，被审查者需要针对问题进行回复澄清

3. 开发者在提交代码之前，仔细阅读代码变更。并在RP描述中添加代码变更目的，自测截图或录屏

4. 自动化可以自动化的东西
> 使用样式检查器、语法检查器和其他自动化工具(如静态分析工具)来帮助改进代码。

5. 不要添加太多的评审员
> 一些研究表明， Code Review 的最佳实践是只添加两个活跃的评审人员。许多 Code Review 工具允许通知开发人员，而无需强制他们进行评审。这可以确保他们随时可以获取最新消息，知道正在发生什么，但是消除了它们对代码进行 Review 的义务,但是不要将所有人都添加到通知列表中。只添加那些实际上从 Code Review 过程中获益的人员。

6.添加初级开发人员，让他们学习
> 考虑添加不熟悉代码库的评审人员，这样做能有效的传播知识。

7. 在评审之前提醒评审人员

8.使用Code Review工具将讨论过程记录下来

9.合理组织每天的工作，给专门Code Review留出时间

10.审核人的评论应该基于原则，而不是观点
> 在写评论的时候写上要做什么和为什么这样做。例如，当一个函数即在负责下载文件又在负责解析文件内容。评论 “我们应该把这个 方法 切分成两个” 是不太好的，更好的说法是 “现在这个 方法 负责下载并且解析文件。根据单一职责原则，我们应该把它切分成两个 函数，一个负责下载，一个负责解析。”

# 参考文章
1. [如何用人类的方式进行 Code Review(二)](https://mp.weixin.qq.com/s/aUX56CSteclSvbdnygNK2w)
2. [如何用人类的方式进行 Code Review](https://mp.weixin.qq.com/s/kJC1NbHXvJ6w9CSKy6Zimw)
3. [被验证过的 Code Review 最佳实践](https://mp.weixin.qq.com/s/0SmjPOmil5PitGlTu5dk7A)
4. [Code Review最佳实践](https://mp.weixin.qq.com/s/S-tzu5Uu23ixuMozgWOApw)