# vue create 创建项目

当使用`vue create`创建项目，如果项目的目录已经存在，那么 Vue Cli 就会提示：1. overwrite，2. merge，3. cancel。

## overwrite

删除目录，然后用 preset 的值重新生成项目

## merge 

直接用 preset 的值生成项目，如果新生成的某个文件在目录中已经存在，那么会用新的内容覆盖旧的内容；如果目录中存在额外的文件，那么这个文件保持不变

## cancel

停止创建项目
