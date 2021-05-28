wwo支撑系统, 工单/问答社区融合

> 以下操作可以在 `docker` -> `Dashboard` 上面通过GUI界面操作。

## 安装
安装docker，docker-compose

## 运行

```shell
docker-compose up -d
```

## 进入前端环境

```shell
docker-compose exec frontend sh
# 安装第三方库
npm i xxx
```
## 查看日志

```shell
docker-compose logs -f [frontend, backend]
```

## 重启

```shell
docker-compose restart
```

## 停止运行

```shell
docker-compose stop
```