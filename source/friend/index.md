---
date: 2022-12-24 14:44:19
header: false
sidebar:
- ghuser
- friendswelcome
title: 友链
updated: 2023-01-27 14:49:33
---
<div id="friend-content" class="friend-content"></div>
<link rel="stylesheet" href="https://unpkg.com/qexo-friends/friends.css"/>
<script src="https://unpkg.com/qexo-friends/Stellar/friends.js"></script>
<script>loadQexoFriends("friend-content", "https://qexo.lvbyte.top")</script>

{% folding 我的信息  %}

```
网站名称：字节君
链接地址：https://blog.lvbyte.top/
头像地址：https://blog.lvbyte.top/icon.jpg
网站简介：热爱漫无边际，生活自有分寸
```

{% endfolding %}

{% folding 添加友链  %}

<div class="friend-api">
  <style>input.qexo-friend-input {flex: 1 1 0%;display: block;width: 100%;height: calc(1.5em + 1.25rem + 2px);font-weight: 400;color: #8898aa;box-shadow: 0 3px 2px rgb(233 236 239 / 5%);transition: all 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);overflow: visible;margin: 0;font-family: inherit;font-size: inherit;line-height: inherit;position: relative;display: flex;flex-direction: column;min-width: 0;word-wrap: break-word;background-color: #fff;background-clip: border-box;border: 1px solid rgba(0, 0, 0, 0.05);border-radius: 0.375rem;black;}button.qexo-friend-button {cursor: pointer;position: relative;text-transform: none;transition: all 0.15s ease;letter-spacing: 0.025em;font-size: 0.875rem;will-change: transform;color: #fff;background-color: #5e72e4;border-color: #5e72e4;box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);vertical-align: middle;cursor: pointer;user-select: none;border: 1px solid transparent;padding: 0.625rem 1.25rem;font-size: 0.875rem;line-height: 1.5;border-radius: 0.25rem;transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;}</style>
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
    qexo_friend_api("friends-api","https://qexo.lvbyte.top")
</script>

{% endfolding %}
