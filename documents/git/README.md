# git

## 最小配置
### 配置user信息
1. 配置user.name : git config --global user.name 'your name'
2. 配置user.email : git config --global user.email 'your email'
### config 参数
1. git config --local : 只对某个仓库有效
2. git config --global : 对当前用户所有的仓库有效
3. git config --system : 对系统所有的登录用户有效
> 缺省相当于 local

### 显示config的配置
 git config --list
`git config --list`会将所有范围的config配置都显示出来。如果只想显示某一个范围的config配置，就要加范围参数(如：--local,--global,--system)
1. git config --list 
2. git config --list --local
3. git config --list --global
4. git config --list --system

## 给文件重命名
git mv 旧的文件名 新的文件名

## git log 查看版本演变历史
1. git log 查看当前分支的演变历史
2. git log --oneline 查看当前分支的简洁版演变历史
3. git log --all 查看所有分支演变历史
4. git log --graph 图形化查看当前分支的演变历史（在存在多个分支时会显示当前分支与其他分支之间的合并记录以及从当前分支检出新分支的记录）
5. git log 分支名 查看指定分支的历史演变记录
6. git log -n4(-nx) 显示当前分支最近的4条记录
> --oneline , --all,分支名,--graph,-nx这些参数可以组合使用。在使用了--all参数的同时又指定了某个分支名，分支名会被忽略。

## .git目录
### HEAD文件
HEAD文件中保存了一个引用，这个引用指向当前工作的分支(先不谈分离头指针的状态)。
### config文件
config文件中保存的是这个仓库的配置信息，当使用git config --local 会修改/显示这个文件中的内容
### refs文件夹
refs文件夹中保存了这个仓库中所有的分支(refs/heads)和标签(refs/tags)
#### refs/heads文件夹
refs/heads文件夹中保存当前仓库以分支名命名的文件(如master,dev等),这些文件中保存了一个commit,表示这个文件对应的指针指向的commit。例如，master文件中保存的是master指针指向的commit，dev文件中保存的是dev指针指向的commit
#### refs/tags文件夹
refs/tags文件夹中保存了当前仓库以标签名命名的文件(如v1.0.0等)，这些文件中保存了一个commit.

## git中三大对象commit , tree 和 blob
每次执行git commit操作都会生成一个commit对象，每个commit对象中会包含一个tree对象。tree对象中保存了本次执行commit操作时本项目仓库中所有文件夹和文件的快照，在git中blob对象表示文件，如果两个文件如果文件内容一样，那么对应同一个blob。
> git cat-file -p 哈希值 ： 显示这个哈希值中的内容。git cat-file -t 哈希值：显示这个哈希值的对象类型

## 分离头指针
执行 git checkout < commit > 命令会让git出于分离头指针的状态。在处于分离头指针的状态可以继续开发也可以继续产生commit而且不会影响其他分支。分离头指针的本质就是当前工作在没有分支的状态下，在这种状态下做的变更不与任何分支绑定，在分离头指针的状态下做了变更并产生了commit，然后又切换到其他分支，之前产生的变更很可能会被git当作垃圾清理掉

## HEAD指针和branch的关系
不管是在分离头指针的状态（即：HEAD不与任何一个分支绑定）还是HEAD与某个分支绑定，HEAD指针的落脚点都是某个commit。切换到新的分支，HEAD会指向新分支最近一次的commit。

## 删除分支
1. git branch -d 分支名
2. git branch -D 分支名
> `git branch -d 分支名` 命令删除分支，如果这个这个分支还没有被合并，git会给提示。`git branch -D 分支名`表示强制删除分支

## 修改commit的message
### 修改最新一次commit的message
git commit --amend
### 修改老的commit的message
git rebase -i < commit >
> 如果要修改某次commit的message信息，可以使用`git rebase -i < commit >`命令，参数-i后的commit值是需要修改message信息的commit的父commit的哈希值。执行这个命名后根据命令行中的交互进行操作就可以达到修改commit message的目的，在交互界面使用r命令。通过变基修改了一个commit的message信息，会导致这个commit的hash值以及后续commit的hash值发生变化。***不要对已经推送的commit进行变基操作***

修改commit的message信息会导致commit的hash值发生变化（实际上是新创建的commit）。只要commit的hash值，更新时间，parent，作者等属性发生了变化，在git眼里就是不同的commit。
### 将多个连续的commit合并成一个commit
> git rebase -i < commit >。-i参数后的commit hash值是需要合并成一个commit的多个连续commit的最近的父commit的hash值。在交互界面使用s命令
### 将间隔的多个commit合并成一个commit
> git rebase -i < commit >。在交互界面中使用s命令，并且将间隔的commit放在一起

如果要修改第一次提交的commit message， 在提交列表中，可以手工将根commit添加进来。更简单的方式是使用 `git rebase -i --root` 命令，该命令允许你在分支上变基根提交.

## 比较文件的差异
### 比较暂存区和HEAD所含文件的差异
git diff --cached
### 比较工作区和暂存区的差异
git diff
### 比较工作区和HEAD所含文件的差异
git diff HEAD
### 比较两个commit所含文件的差异
git diff commitId1 commitId2
## 比较两个分支所含文件的差异
git diff branch1 branch2。比较分支的差异其实也是比较commit的差异。分支名就是一个指针，它指向某个commit。
> 如果不指定文件，就是比较所有文件的差异。git diff -- <filename> 只比较指定文件的差异。-- 是为了让git在读取命令参数时消除歧义用的，--后面的是文件或目录（可以是多个文件和目录）。
## 恢复文件
### 将暂存区恢复成和HEAD一样的
git reset HEAD <filename>...
> 第一次修改了readme文件，然后添加到暂存区，然后继续修改readme文件，这个时候执行git reset HEAD，会把暂存区恢复成HEAD一样，工作区还是保持最后修改的文件状态。
### 消除最近的几次提交
git reset <commit>
> 将HEAD指向某次commit

git reset 命令还可以加--hard || --soft || --mixed
1. --hard : 将暂存区，工作区恢复成HEAD一样的。
2. --mixed: 将暂存区恢复成和HEAD一样的，工作区的修改保留(默认)
3. --soft:工作区和暂存区的修改都保留

### 将工作区恢复成和暂存区一样的
git checkout -- <filename>... 

## 删除文件
git rm <filename>

## 储藏
### 将工作区和暂存区的更改储藏
git stash <save stashname>
### 应用储藏的内容
git stash apply <stashname> . 如果不指定stashname就应用最新储藏的内容。
### 移除储藏的内容
git stash drop <stashname> 如果不指定stashname就移除最新储藏的内容
### 应用并移除储藏
git stash pop <stashname>
### 显示储藏内容列表
git stash list
### 从储藏中创建分支
git stash branch <branchname> 这会创建一个新的分支，并在新分支上应用储藏的内容，如果成功，将会丢弃储藏。

> 你可以在其中一个分支上保留一份储藏，随后切换到另外一个分支，再重新应用这些变更。在工作目录里包含已修改和未提交的文件时，你也可以应用储藏——Git 会给出归并冲突如果有任何变更无法干净地被应用。

## 设置git忽略文件
.gitignore
> .gitignore中的设置对已经被提交到暂存区或者已经被git管理的文件不会起作用

## git备份
使用git clone命令建立版本库克隆，并且使用git pull和git push 命令使各个克隆之间同步。

git的版本库和工作区在一起，所以存在删除项目工作区的同时将版本库也删除的可能性，一个项目仅仅在一个工作区维护太危险了，所以将git备份是很明智的。
### 在git中常用的协议
|协议名|语法格式|说明|
|---|---|---|
|本地协议1|/path/to/repo.git|哑协议|
|本地协议2|file:///path/to/repo.git|智能协议|
|http/https协议|http://git-server.com/path/to/repo.git|智能协议|
|ssh协议|user@git-server.com/to/path/repo.git|智能协议|

哑协议传输速度慢，不显示传输进度。智能协议传输速度快且显示传输进度

### git clone命令
git clone 命令有三种用法，分别如下：
1. `git clone <repository> <directory>`
2. `git clone --bare   <repository> <directory.git>`
3. `git clone --mirror <repository> <directory.git>`

这三种用法的区别
* 用法1会将`<repository>`指向的版本库克隆到`<directory>`目录中，目录`<directory>`相当于版本库的工作区，文件会被检出，版本库位于工作区下的.git目录中。
* 用法2和用法3创建的克隆版本库不包含工作区，直接是版本库的内容，是一个裸仓库。上述例子中克隆出的裸版本库目录名是directory.git。
* 用法2和用法3的差别是，用法3克隆出的裸仓库对上游版本库进行了注册，可以在裸版本库中执行git fetch命令和上游版本库进行持续同步

### 备份到本地
1. 不使用 --bare 和 --mirror参数克隆的仓库会包含工作区，源仓库的工作区和备份仓库的工作区是对等的。对于这种对等工作区模式，版本库的同步只有一种可行的操作方式：在备份库中执行 git pull 命令从源仓库中拉取新的提交实现版本库同步。

    例子：git clone file:///Users/kyrie/Desktop/myDocuments/mini learn_doc
2. 备份生成裸版本库（更常用）。可以从源版本库向备份裸版本库执行推送操作，但是推送命令还需要加上裸版本库的路径

    例子 git clone --bare file:///Users/kyrie/Desktop/myDocuments/mini doc.git
        
        git push /Users/kyrie/Desktop/bare/doc.git
        

