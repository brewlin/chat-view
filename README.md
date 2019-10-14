# swoft-im & swoole-im 前端服务
## @install
```proto
cd chat-view

composer config  repo.packagist composer https://mirrors.aliyun.com/composer/

composer install
```
## @配置文件修改
```proto
cd project/application
修改database.php 数据库配置文件

cd project/public/im/ws/src/js
修改config文件，配置websocket地址和端口
```
## @相关扩展
```proto
apt-get install php7.1-redis
apt-get install php7.1-pdo-mysql
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

## @相关问题排查
### 1.pdo-mysql
安装pdo-mysql 扩展 `apt-get install php7.*-pdo-mysql`
```proto
[0] PDOException in Connection.php line 293
could not find driver
                $this->fetchType = $config['result_type'];
            }
            try {
                if (empty($config['dsn'])) {
                    $config['dsn'] = $this->parseDsn($config);
                }
                if ($config['debug']) {
                    $startTime = microtime(true);
                }
                $this->links[$linkNum] = new PDO($config['dsn'], $config['username'], $config['password'], $params);
                if ($config['debug']) {
                    // 记录数据库连接信息
                    Log::record('[ DB ] CONNECT:[ UseTime:' . number_format(microtime(true) - $startTime, 6) . 's ] ' . $config['dsn'], 'sql');
                }
            } catch (\PDOException $e) {
                if ($autoConnection) {
                    Log::record($e->getMessage(), 'error');
                    return $this->connect($autoCon
```

### 2. token失效
部署时一直提示token失效 则表示redis扩展没有安装