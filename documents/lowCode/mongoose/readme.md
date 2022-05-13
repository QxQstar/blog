## 快速开始

## 连接数据库

## Schema

Schema 最终映射到 MongoDB 的 Collection 上，它定义了该 Collection 中每个 Document 的形状。

### 定义 Schema

限制字段

### 使用 Schema

要使用定义的 Schema，必须将它转化成 Model。每个 Model 实例在 MongoDB 中都对应了一个 Document。

### 添加实例方法

### 添加静态方法

## 验证器

### 内置的验证器

### 自定义验证器

## 中间件

必须在调用mongoose.model()之前添加中间件。