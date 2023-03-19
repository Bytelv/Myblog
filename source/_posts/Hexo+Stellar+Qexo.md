---
abbrlink: ''
banner: null
categories:
- - Hexo主题
cover: https://blog.lvbyte.top/img/2023/1/博客封面模板(1).jpg
date: '2023-01-22 13:05:22'
description: null
poster:
  caption: null
  color: null
  headline: null
  topic: null
references:
- title: 零基础创建一个属于自己的博客网站
  url: https://xaoxuu.com/blog/20221217/#%E6%BA%90%E7%A0%81%E7%AE%A1%E7%90%86%EF%BC%88%E5%BB%BA%E8%AE%AE%EF%BC%89
- title: 搭建环境与部署博客的最简便方法
  url: https://xaoxuu.com/blog/20221126/#GitHub-Actions-%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2
- title: Qexo文档
  url: https://www.oplog.cn/
tags:
- Hexo
- Stellar
- Qexo
- Github actions
title: Hexo Stellar主题+Qexo后台管理
updated: Sat, 11 Mar 2023 16:01:05 GMT
---
hexo stellar主题实现Qexo后台管理

<!-- more -->

# 前言

本文前提：

1. 你已经在本地安装好hexo和stellar====>[来这里安装](https://xaoxuu.com/wiki/stellar/#start)
2. 有足够的耐心研究
3. 你会使用工具（git，baidu，doc）
4. 【】框内的内容需要根据你的自定义进行修改

本文实现目标：

1. 后台管理Hexo博客
2. 访客填写友链申请，博主可在后台审核
3. 实现“朋友圈”阅读友链的文章

# 后台管理Hexo博客

### 上传Hexo源码到Github

##### 建Github仓库

新建一个github仓库，名字为【Myblog_source】(tips:名字你可以自己取)

这个仓库是用来存放你的Hexo源码，建议将此仓库设置为「Private」即私有仓库

##### git clone该仓库到本地

```
git clone https://github.com/【username】/【Myblog-source】
```

[tips: 【username】更改为你的github用户名 【Myblog-source】更改为你刚刚建立的Github仓库名]

###### 上传源码

将你本地的Hexo 源码文件夹全部复制进 【Myblog_source】

1.在你【Myblog_source】文件夹，新建一个「.gitignore」文件，内容为：

```
.DS_Store
node_modules
db.json
.deploy_git
public
```

2.上传至Github

```
git add --all
git commit -m "update"
git push origin main
```

最终 **Myblog-source** 仓库目录结构会是这样的：

```
myblog-source:
  - scaffolds: # 模版
    - draft.md
    - page.md
    - post.md
  - source:
    _posts: # 这里面存放文章
      - xxx.md
  - themes:
    ...
  - _config.yml # 配置文件
  - package.json
  ...
```

### GitHub Actions 自动化部署

**原理**：通过 GitHub Actions 可以提交源码到【Myblog_source】，然后由Github action自动构建生成页面到仓库【Myblog】(Github actions帮你Hexo三连)

在【Myblog_source】/.github/workflows/

新建文件： 【auto-deploy.yml】

文件内容如下：

```
name: auto deploy

on:
  workflow_dispatch:
  push:

jobs:
  build:
    runs-on: ubuntu-latest # 运行环境为最新版 Ubuntu
    name: auto deploy
    steps:
    # 1. 获取源码
    - name: Checkout
      uses: actions/checkout@v3 # 使用 actions/checkout@v3
      with: # 条件
        submodules: true # Checkout private submodules(themes or something else). 当有子模块时切换分支？
    # 2. 配置环境
    - name: Setup Node.js 18.12.x
      uses: actions/setup-node@master
      with:
        node-version: "18.12.x"
    # 3. 生成静态文件
    - name: Generate Public Files
      run: |
        npm i
        npm install hexo-cli -g
        hexo clean && hexo generate
    # 4. 部署到 GitHub 仓库（可选）
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        deploy_key: ${{ secrets.DEPLOY_KEY }}
        external_repository: 【xaoxuu/xaoxuu.github.io】
        publish_branch: gh-pages
        publish_dir: ./public
        commit_message: ${{ github.event.head_commit.message }}
        user_name: 'github-actions[bot]'
        user_email: 'github-actions[bot]@users.noreply.github.com'
    # 5. 部署到服务器（可选）
    - name: Deploy to Server
      uses: easingthemes/ssh-deploy@v3
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
        ARGS: "-rltgoDzvO --delete"
        EXCLUDE: ".well-known, .user.ini"
        SOURCE: public/
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_PORT: ${{ secrets.REMOTE_PORT }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: ${{ secrets.TARGET }}
```

Tips:

**1.增加环境变量**

首先，在本地创建密钥

git bash输入命令：ssh-keygen -f github-deploy-key 会获取两个文件：github-deploy-key （私钥）github-deploy-key.pub（公钥）

源码仓库配置

要在 Settings -> secrets and variables -> DEPLOY\_KEY中填写对应的值：github-deploy-key （私钥）

Hexo生成的静态文件仓库配置

要在 Settings -> Deploy keys  新建一个名为DEPLOY\_KEY，值为github-deploy-key.pub（公钥）

**2.【xaoxuu/xaoxuu.github.io】更改为你自己的仓库【Your name/Myblog】**

### 安装Qexo

##### Vercel 部署 (MongoDB) [#](https://www.oplog.cn/qexo/start/build.html#vercel-部署-mongodb)

1. **申请 MongoDB 数据库** [#](https://www.oplog.cn/qexo/start/build.html#申请-mongodb-数据库)

[注册 MongoDB 账号](https://www.mongodb.com/cloud/atlas/register) 创建免费 MongoDB 数据库，区域**一定要选择 AWS / N. Virginia (us-east-1)** 在 Clusters 页面点击 CONNECT，按步骤设置允许所有 IP 地址的连接），创建数据库用户，并记录数据库连接信息，密码即为你所设置的值 ![](https://pic.hipyt.cn/pic/2023/01/03/e1b3ca7b101fa.png)

**2.一键部署** [#](https://www.oplog.cn/qexo/start/build.html#一键部署)

[![部署到 Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/am-abudu/Qexo)

首次部署会报错, 请无视并重新进入项目, 在vercel项目设置界面添加环境变量 Environment Variables


| 名称         | 意义                                    | 示例                                    |
| ------------ | --------------------------------------- | --------------------------------------- |
| MONGODB_HOST | MongoDB 数据库连接地址                  | mongodb+srv://cluster0.xxxx.mongodb.net |
| MONGODB_PORT | MongoDB 数据库通信端口 默认应填写 27017 | 27017                                   |
| MONGODB_USER | MongoDB 数据库用户名                    | abudu                                   |
| MONGODB_DB   | MongoDB 数据库名                        | Cluster0                                |
| MONGODB_PASS | MongoDB 数据库密码                      | password                                |

在 Deployments 点击 Redeploy 开始部署，若没有 Error 信息即可打开域名进入初始化引导

**3.初始化引导**

* Github仓库： username/【Myblog_source】
* Github密钥： 于 [Github 设置](https://github.com/settings/tokens) 生成的 Token (建议使用 Classical) 需要 Repo 下的至少读取和写入权限 不建议给出所有权限
* 仓库路径： 留空
* 项目分支： main或者master

4.其他设置

具体参考 [Qexo官方文档](https://www.oplog.cn/qexo/)

### 为主题添加Qexo友情链接

在你的友情链接页面的markdown文件中添加如下代码：

```html
<div id="friend-content" class="friend-content"></div>
<link rel="stylesheet" href="https://unpkg.com/qexo-friends/friends.css"/>
<script src="https://unpkg.com/qexo-friends/Stellar/friends.js"></script>
<script>loadQexoFriends("friend-content","${SITE}")</script>
```

Tips: **${SITE}** 请更改为你自己的Qexo链接

### 添加Qexo友情链接申请界面

在你的友情链接页面的markdown文件中添加如下代码：

```html
<div class="friend-api">
  <style>input.qexo-friend-input {flex: 1 1 0%;display: block;width: 100%;height: calc(1.5em + 1.25rem + 2px);padding: 0.625rem 0.75rem;font-weight: 400;color: #8898aa;box-shadow: 0 3px 2px rgb(233 236 239 / 5%);transition: all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);overflow: visible;margin: 0;font-family: inherit;font-size: inherit;line-height: inherit;position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 0.375rem;black;}button.qexo-friend-button {cursor: pointer;position: relative;text-transform: none;transition: all 0.15s ease;letter-spacing: 0.025em;font-size: 0.875rem;will-change: transform;color: #fff;background-color: #5e72e4;border-color: #5e72e4;box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);vertical-align: middle;cursor: pointer;user-select: none;border: 1px solid transparent;padding: 0.625rem 1.25rem;font-size: 0.875rem;line-height: 1.5;border-radius: 0.25rem;transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}</style>
  <input type="text" id="qexo_friend_name" class="qexo-friend-input" placeholder="网站名">
  <br>
  <input type="text" id="qexo_friend_brief introduction" class="qexo-friend-input" placeholder="网站简介">
  <br>
  <input type="text" id="qexo_friend_website" class="qexo-friend-input" placeholder="网址">
  <br>
  <input type="text" id="qexo_friend_logo" class="qexo-friend-input" placeholder="头像">
  <br>
  <button type="button" class="qexo-friend-button" onclick="javascript:friend_api()">申请</button>
</div>
<script src="https://npm.elemecdn.com/qexo-friends/friends-api.js">
</script>
<script>
    qexo_friend_api("friends-api","${SITE}")
</script>
```

Tips: **${SITE}** 请更改为你自己的Qexo链接

在 https://你的Qexo链接/settings.yml

API配置=>启用友情申请api 更改为： **是**

### 添加Qexo友链到[朋友圈]

Strllar主题提供了一个[友链朋友圈极简版](https://xaoxuu.com/wiki/stellar/fcircle/) 的功能，让我们可以在博客上阅读朋友们的文章，可以参考[我的朋友圈](https://blog.lvbyte.top/friend/rss/) 但这个功能仅仅支持[Github动态友链](https://xaoxuu.com/wiki/stellar/tag-plugins/data/#%E5%AE%9E%E7%8E%B0%E5%8A%A8%E6%80%81%E5%8F%8B%E9%93%BE) 我们Qexo的友链无法同步到朋友圈。

为了偷懒，我研究了一下[友链朋友圈的开发文档](https://fcircle-doc.yyyzyyyz.cn/#/developmentdoc) 发现文档提供了一个[配置项json友链](https://fcircle-doc.yyyzyyyz.cn/#/developmentdoc?id=%e9%85%8d%e7%bd%ae%e9%a1%b9json%e5%8f%8b%e9%93%be) 的功能。

结合[Qexo的API文档=>pub-friends](https://www.oplog.cn/qexo/dev/api.html#pub-friends) ,我决定写一个python程序，将Qexo的json格式转换为友链朋友圈支持的json格式
{% tabs active:2 align:center %}

<!-- tab Qexo的json数据 -->

```json
{
    "data": [
        {
            "name": "iMaeGoo’s Blog",
            "url": "https://www.imaegoo.com/",
            "image": "https://www.imaegoo.com/images/avatar.jpg",
            "description": "虹墨空间站",
            "time": "1642516414.3821218"
        },
        {
            "name": "Icarus",
            "url": "https://ppoffice.github.io/hexo-theme-icarus/",
            "image": "https://ppoffice.github.io/hexo-theme-icarus/img/avatar.png",
            "description": "本站主题",
            "time": "1642516682.7982264"
        }
    ],
    "status": true
}
```

<!-- tab 友链朋友圈支持的json格式 -->

```json
{
  "friends": [
    [
      "贰猹の小窝",   # 友链名称
      "https://noionion.top/",  # 友链地址
      "https://pub-noionion.oss-cn-hangzhou.aliyuncs.com/head.jpg"  # 友链头像
    ],
    [
      "Akilarの糖果屋",  # 友链名称
      "https://akilar.top/",  # 友链地址
      "https://akilar.top/images/headimage.png" # 友链头像
    ],
    [
      "elizen", # 友链名称
      "https://elizen.me/", # 友链地址
      "https://akilar.top/images/headimage.png", # 友链头像
      "hello.xml"  # 自定义后缀
    ],
    ....
  ]
}
```

{% endtabs %}

我的python转换格式的代码如下：

```python
import json, requests 

url = requests.get("https://你的Qexo链接/pub/friends/")  #获取友链
text = url.text   #解析json数据
data = json.loads(text)     #获取data数据
data2 = data['data'] #data2为进入json data类中

#以上代码为解析Qexo友链json数据为python数据

#Friends_circle为friends字典   Friends_links为friends列表，其中应有len(data2)个嵌套的Friends列表   Friends列表为Qexo友链
#len(data2)为友链数量

Friends_circle={}  #定义列表和字典
Friends_links=[]
Friends=[]

num=len(data2)
count=0
for _ in range(num):  #重复输入友链数据至Friend_circle字典中
    Friends=[1,2,3]  #初始化Friends列表
    Friends[0]=data2[count]['name']   #Friends列表数据注入
    Friends[1]=data2[count]['url']
    Friends[2]=data2[count]['image']   
    Friends_links.append(Friends)
    Friends_circle ={"friends":  Friends_links   }
    Friends=[1,2,3]
    count=count+1  #进位

print(Friends_circle)
Friends_json=json.dumps(Friends_circle)
print("Json数据为：",Friends_json)
with open('friends.json', 'w') as f:
    f.write(Friends_json)
    f.close()

```

请注意：将【你的Qexo链接】设置为你的Qexo链接,运行完这个python文件，同目录下会生成一个friends.json的文件，该文件是匹配友链朋友圈的json格式

#### 如何使用这个代码？

你可以利用github action，定时运行该命令。

#### 我如何错误地使用这个代码？

局限于我的技术水平，我在[我的脚本库](https://github.com/Bytelv/Scripts-library) 中配置github action时无法保存friends.json到仓库，我用的是[这个action](https://github.com/action-x/commit) 但始终无法运行。我的.yml文件如下：

```yaml
name: Qexo_Json_to_circle

on:
  push:
    branches:
      - main
 
  workflow_dispatch:
  
jobs:
  build:
    runs-on: ubuntu-latest
  
    steps:
    - name: Checkout
      uses: actions/checkout@master

    - name: Set up Python
      uses: actions/setup-python@v1
      with:
        python-version: 3.8
  
    - name: Import requests
      run: |
          pip install -r requirements.txt
    - name: Qexo_Json_to_circle
      run: |
        python Qexo_Json_to_circle/Qexo_Json.py
  
    - name: ls
      run: |
        cd ./Qexo_Json_to_circle
        ls
  
    - name: Read_json
      run: |
        cat ./Qexo_Json_to_circle/friends.json | jq
  
  
  
    - name: Commit & Push
      uses: action-x/commit@v2.9
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        push-branch: 'main'
        force-push: 'true'
        commit-message: 'Generate Json'
        name: github-actions[bot]
        email: github-actions[bot]@noreply.github.com
```

报错内容为：

```
 Traceback (most recent call last):
  File "/entrypoint.py", line 58, in <module>
    run()
  File "/entrypoint.py", line 55, in run
    debug(git(push_args))
  File "/usr/local/lib/python3.7/site-packages/plumbum/commands/base.py", line 113, in __call__
    return self.run(args, **kwargs)[1]
  File "/usr/local/lib/python3.7/site-packages/plumbum/commands/base.py", line 252, in run
    return p.run()
  File "/usr/local/lib/python3.7/site-packages/plumbum/commands/base.py", line 215, in runner
    return run_proc(p, retcode, timeout)
  File "/usr/local/lib/python3.7/site-packages/plumbum/commands/processes.py", line 304, in run_proc
    return _check_process(proc, retcode, timeout, stdout, stderr)
  File "/usr/local/lib/python3.7/site-packages/plumbum/commands/processes.py", line 17, in _check_process
    proc.verify(retcode, timeout, stdout, stderr)
  File "/usr/local/lib/python3.7/site-packages/plumbum/machines/base.py", line 28, in verify
    getattr(self, "argv", None), self.returncode, stdout, stderr
plumbum.commands.processes.ProcessExecutionError: Unexpected exit code: 128
Command line: | /usr/bin/git push --follow-tags --set-upstream origin main --force
Stderr:       | remote: Permission to Bytelv/Scripts-library.git denied to github-actions[bot].
              | fatal: unable to access 'https://github.com/Bytelv/Scripts-library/': The requested URL returned error: 403
```

运行的action链接： https://github.com/Bytelv/Scripts-library/actions/runs/3993879950/jobs/6850990934

希望有大佬可以为我解答

#### 我如何奇葩地使用这个代码？

迫不得已，我将我的python文件[QexoFriends.py](https://github.com/Bytelv/friends/blob/main/generator/QexoFriends.py) 放在了fork[XAOXUU的issues-json-generator](https://github.com/xaoxuu/issues-json-generator) 的[friends仓库](https://github.com/Bytelv/friends/blob/main/generator/QexoFriends.py) 中，然后修改Github action配置文件，即[generator.yml](https://github.com/Bytelv/friends/blob/main/.github/workflows/generator.yml)，修改后的.yml文件如下：

```yml
name: Generator

on:
  issues:
  watch:
    types: [started]
  schedule:
    - cron: "*/5  * * * *"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@master
    - name: Set up Python #安装python
      uses: actions/setup-python@v1
      with:
        python-version: 3.8
    - name: Install requirements #安装requests
      run: |
        pip install -r requirements.txt
    - name: Update links #更新
      run: |
        python generator/main.py
        python generator/QexoFriends.py
    - name: Commit & Push
      uses: action-x/commit@v2.9
      with:
        github-token: ${{ secrets.GITHUB_TOKEN }}
        push-branch: 'output'
        force-push: 'true'
        commit-message: 'Generate Json'
        name: github-actions[bot]
        email: github-actions[bot]@noreply.github.com
```

只做了小小的改动，运行github action可以正确保存friends.json，输出的文件位于output分支的主目录下，我的文件在这里： https://github.com/Bytelv/friends/blob/output/friends.json

#### 修改友链朋友圈配置文件

关于启动stellar朋友圈的功能，这里不说了，详情参考：[使用「友链朋友圈」极简版](https://xaoxuu.com/wiki/stellar/fcircle/)

这里直接讲修改配置文件在 hexo-circle-of-friends/hexo_circle_of_friends/fc_settings.yml

```
# 友链页地址
# 参数说明：
# link：https://blog.lvbyte.top/friend/   
# theme：必填，友链页的获取策略。需要指定该页面的主题，可选参数如下（这些是目前支持的主题）：stellar
#   - common1: 通用主题1，请参考：https://fcircle-doc.yyyzyyyz.cn/#/developmentdoc?id=友链页适配
#   - common2: 通用主题2，请参考：https://fcircle-doc.yyyzyyyz.cn/#/developmentdoc?id=友链页适配
#   - butterfly：butterfly主题
#   - fluid：fluid主题
#   - matery：matery主题
#   - nexmoe：nexmoe主题
#   - stun：stun主题
#   - sakura: sakura主题
#   - volantis：volantis主题
#   - Yun：Yun主题
#   - stellar：stellar主题
# 支持配置多个友链页面并指定不同主题策略，每个用{}分隔，它们会被同时爬取，数据保存在一起。***至少配置一个***
LINK:
    - {link: "https://blog.lvbyte.top/friend/", theme: "stellar"}  # 友链页地址1，修改为你的友链页地址
#    - {link: "https://noionion.top/link/", theme: "butterfly"} # 友链页地址2
#    - {link: "https://immmmm.com/about/", theme: "common1"} # 友链页地址3


# 配置项友链
# enable：# 是否启用配置项友链 true/false（针对还未适配主题或者有定制需求的用户）
# json_api：通过json格式配置友链，详见：https://fcircle-doc.js.cool/#/developmentdoc?id=配置项json友链
# list字段填写格式：["name", "link", "avatar","suffix"]，其中：
#       name：必填，友链的名字
#       link：必填，友链主页地址
#       avatar：必填，头像地址
#       suffix：选填，自定义订阅后缀，主要针对不规范的网站订阅后缀，见示例2
SETTINGS_FRIENDS_LINKS: {
    enable: true,
    json_api: "https://raw.githubusercontent.com/Bytelv/friends/output/friends.json",  #修改为你的friends.json地址
    list: []
}

# get links from gitee
# 从gitee issue中获取友链
GITEE_FRIENDS_LINKS: {
    enable: false, # true 开启gitee issue兼容
    type: "volantis",  # volantis/stellar用户请在这里填写volantis
    owner:  "Bytelv",  # 填写你的gitee用户名   
    repo:  "blogroll",  # 填写你的gitee仓库名
    state:  "open",  # 填写抓取的issue状态(open/closed)
}

# get links from github
# 从github issue中获取友链
GITHUB_FRIENDS_LINKS: {
    enable: false, # true 开启github issue兼容
    type: "volantis",  # volantis/stellar用户请在这里填写volantis
    owner: "Bytelv",  # 填写你的github用户名
    repo: "friends",  # 填写你的github仓库名
    state: "open",  # 填写抓取的issue状态(open/closed)
    label: "active",  # 填写抓取的issue标签
}

# block site list
# 添加屏蔽站点，支持正则表达式
BLOCK_SITE: [
#    https://example.com/, # 屏蔽 https://example.com/
#    .*\.com,  # 含有.com的全部屏蔽
#    ^http://,  # http开头的全部屏蔽
]


# 启用HTTP代理，此项设为true，并且需要添加一个环境变量，名称为PROXY，值为[IP]:[端口]，比如：192.168.1.106:8080
HTTP_PROXY: false

# 过期文章清除（天）
OUTDATE_CLEAN: 60

# 5.x以后默认为sqlite，同时不建议使用leancloud
# 存储方式，可选项：leancloud，mysql，sqlite，mongodb；默认为sqlite
DATABASE: "sqlite"

# 部署方式，可选项：github，server，docker；默认为github
DEPLOY_TYPE: "github"
```

需要进行修改的地方：

1.links(友链页地址1)  修改为你的友链链接

2.json_api 修改为你的friends.json链接，我推荐使用raw.github 因为像jsdelivr这类的cdn文件更新不及时
