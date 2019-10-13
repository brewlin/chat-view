# swoft-im & swoole-im 前端服务
## @install
```proto
cd chat-view
composer install
```
## @nginx 部署
```proto
    server {
        listen       80;
        server_name  chat.huido.site;

        location / {
            root   /website/chat-view/public;
                        charset   UTF-8;
            index index.php index.html index.htm;
            if (!-e $request_filename){
               rewrite ^(.*)$ /index.php?s=$1 last;
                break;
            }
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        location ~ \.php/?.*$ {
            root           /website/chat-view/public;
		fastcgi_pass unix:/run/php/php7.2-fpm.sock;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  /website/chat-view/public$fastcgi_script_name;
            include        fastcgi_params;
        }
    }

```