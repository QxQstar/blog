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