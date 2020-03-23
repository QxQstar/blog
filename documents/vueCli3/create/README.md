# vue create 创建项目

当使用`vue create`创建项目，如果项目的目录已经存在，那么 Vue Cli 就会提示：1. overwrite，2. merge，3. cancel。

## overwrite

删除目录，然后用 preset 的值重新生成项目

## merge 

直接用 preset 的值生成项目，如果新生成的某个文件在目录中已经存在，那么会用新的内容覆盖旧的内容；如果目录中存在额外的文件，那么这个文件保持不变

## cancel

停止创建项目

## preset

在 Vue CLI 3.x 中 preset 是生成项目的关键。在使用 Vue CLI 3.x 创建 Vue 项目时你可以自己设置 preset 参数，在没有设置 preset 的情况下，Vue CLI 3.x 会使用 inquirer 收集你创建项目选择或者输入的各个参数，然后生成 preset，preset 中包含了 plugins,Vue CLI 3.x 是基于 plugins 生成项目的

