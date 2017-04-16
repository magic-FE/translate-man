<img src="https://cdn.rawgit.com/magic-FE/translate-man/master/src/components/App/icon.svg" alt="logo" width="80" height="80">

# 翻译侠(translate man)

插件地址: [https://chrome.google.com/webstore/detail/translate-man/fapgabkkfcaejckbfmfcdgnfefbmlion](https://chrome.google.com/webstore/detail/translate-man/fapgabkkfcaejckbfmfcdgnfefbmlion)

这是一款浏览器插件（采用 webExtension 开发）,兼容 chrome 和 firefox ，实现上百种语言的翻译,调用谷歌和金山翻译接口，注重用户体验和速度（国内用户调用谷歌翻译不用翻墙）。

打开插件后，自动发送 https://translate.google.com 和 https://trnaslate.google.cn 以此来确定那个网站可以访问。

在主语言或者 UI 界面是中文的情况下，选择优先金山翻译，将会采用金山翻译（提高翻译速度），其他情况会采用谷歌翻译。

## 开发
```shell
npm install

npm start
特殊说明: （build目录下的文件,只有static文件夹和index.html是动态产生的.其他的是源文件）
此命令将
入口: src/index.js 打包到build/static目录下.
入口: src/index.html 打包到build/index.html下.
```

## 发布
```shell
npm run build
```
然后把 build 目录文件压缩为 zip 文件,上次到 google 插件商店。

## 描述
也许是你遇到过最好的翻译插件了吧。
遇到不会的单词?有点单词是链接从而不能划词取到?采用翻译侠，支持鼠标取词，划词翻译，多语种，人性化界面。

1. 全新UI,让界面焕然一新
2. 采用谷歌翻译接口,翻译精准无误
3. 支持多达百种语言,自动识别语种
4. 人性化操作方式、双击翻译、页面取词、统统支持
5. 完全免费，支持谷歌娘语音
6. 持续开发中，如果你觉得好，随手给个五星呗

-------------------------------------------------------------------------------------------------

Support the mouse to take words, zoned word translation, multi-lingual, user-friendly interface.

1. New UI, so that the interface a new look
2. Using Google translation interface, translation accuracy
3. Support up to 100 languages, automatically identify the language
4. User-friendly mode of operation, double-click translation, page word, all support
5. Completely free, support Google voice
6. Continuous development, if you feel good, remember a five-star rating
