用脚本来管理android工程
======================
* [Managing Projects from the Command Line](http://developer.android.com/tools/projects/projects-cmdline.html)
* [Building and Running from the Command Line](http://developer.android.com/tools/building/building-cmdline.html)


新建android工程
----------------------
    > cd D:\Program Files\android-sdk-windows\tools
    > android list target
    > android create project --name appname --target android-17 --path c:/b --package com.pkg --activity MainActivity

项目中的关键文件

* build.xml
* local.properties        -- 配置Android SDK根目录(已经生成, 无需更改)
* project.properties      -- 配置target和开启ProGuard混淆代码(默认没有开启)
* ant.properties          -- 配置密钥
* proguard-project.txt    -- 配置ProGuard混淆(如果没开启ProGuard, 则无需关心)


构建android工程
----------------------
    > ant debug


扩展构建过程
----------------------
1. 配置好key.store后, 无需手动输入
2. 通过custom_rules.xml来定制构建, 如-pre-build
3. 项目采用phonegap/cordova架构, 开启了ProGuard并已配置好
4. 批处理, 用于一步执行构建, 安装, 运行
```
> run(默认构建debug)
> run release
```