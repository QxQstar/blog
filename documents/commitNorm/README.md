# git 版本管理规范

git 版本管理主要从以下几个方面来制定规范。
1. commit message 规范
2. 统一的changelog 文件信息
3. 分支管理
4. tag 

## commit message 规范
   
## 禁止的操作
1. 禁止在团队公共分支上执行git push -f 操作
2. 禁止在团队公共分支执行git base变基操作，团队的公共分支的变更记录只能往前走，不能历史的变更记录
3. 禁止在团队公共分支执行git reset 操作回滚，使用git revert 进行代码回滚