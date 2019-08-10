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
HEAD文件中保存了一个引用，这个引用指向当前工作的分支。
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