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