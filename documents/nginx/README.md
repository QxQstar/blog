# Nginx
## 安装Nginx
在mac上用homebrew 安装 nginx，步骤如下：

1、更新homebrew
```cli
    brew update
```

2、查看nginx是否存在
```cli
    brew search nginx
```

3、查看nginx的基本信息
```cli
    brew info nginx
```

这个命令可以查询是否安装了nginx,nginx的来源,nginx的配置文件等

4、安装nginx
```cli
    brew install nginx
```

5、查看nginx的安装目录
```cli
    brew list nginx
```
## nginx配置文件
运行`brew info nginx` 可以得知nginx的配置文件在`/usr/local/etc/nginx/nginx.conf`

```
#运行用户, 可以不进行设置
#user  nobody;
#Nginx进程，一般设置为和CPU核数一样
worker_processes  1;

#错误日志存放目录
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#进程pid存放位置
#pid        logs/nginx.pid;


events {
    worker_connections  1024; # 单个后台进程的最大并发数
}


http {
    include       mime.types; #文件扩展名与类型映射表
    default_type  application/octet-stream; #默认文件类型
    
    #设置日志模式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main; #nginx访问日志存放位置

    #开启高效传输模式
    sendfile        on; 
    #减少网络报文段的数量
    #tcp_nopush     on; 
    
    #保持连接的时间，也叫超时时间
    #keepalive_timeout  0;
    keepalive_timeout  65;
    
    #开启gzip压缩
    #gzip  on;

    server {
        listen       8080; #配置监听端口
        server_name  localhost; //配置域名

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html; #服务默认启动目录
            index  index.html index.htm; #默认访问文件
        }

        #error_page  404              /404.html; # 配置404页面

        # redirect server error pages to the static page /50x.html
        #
        #错误状态码的显示页面，配置后需要重启
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    #包含的子配置项位置和文件
    include servers/*;
}
```
## nginx服务启动、停止、重启

### 启动nginx
```cli
brew services start nginx

 或者
 
nginx
```
> 启动nginx之后在浏览器中访问http://localhost:8080/就能够看到nginx的欢迎页了
### 停止nginx服务
```cli
nginx -s quit
```
### 重启nginx服务
```cli
brew services restart nginx
```
### 重新载入配置文件
在重新编写或者修改Nginx的配置文件后，都需要作一下重新载入，这时候可以用Nginx给的命令。
```cli
nginx -s reload
```

## nginx访问权限

在location中设置allow 和 deny可以控制访问
```
 location / {
            root   html; #服务默认启动目录
            index  index.html index.htm; #默认访问文件
        }
    location =/admin {
        deny all
    }
    location =/img {
        allow all
    }
    location =/src {
        allow 192.168.5.214
    }
    location ~\.php$ {
        deny all
    }
```

* 用`=`表示精确匹配，用`~` 表示正则匹配。
* 写在上面的权限控制的优先级高于下面的权限控制，如果上面的匹配到了就不会往下走了 

## nginx 设置虚拟主机
> 虚拟主机是指在一台物理主机服务器上划分出多个磁盘空间，每个磁盘空间都是一个虚拟主机，每台虚拟主机都可以对外提供Web服务，并且互不干扰。在外界看来，虚拟主机就是一台独立的服务器主机，这意味着用户能够利用虚拟主机把多个不同域名的网站部署在同一台服务器上，而不必再为某一个网站单独购买一台服务器，既解决了维护服务器技术的难题，同时又极大地节省了服务器硬件成本和相关的维护费用。

### 基于端口好设置虚拟主机
新增一个server

```
server {
        listen       8001;
        server_name  localhost;

        location / {
            root   /usr/local/Cellar/nginx/1.17.3_1/8001root;
            index  index.html index.htm;
        }
    }
```
