# 抱走漫画官网

线上地址：https://mh.diaobaole.top （GitHub Pages，纯静态，没有构建步骤）

## 更新版本 / 下载地址

只改 `versions.json`（在 GitHub 网页上点铅笔图标就能改）：

1. 在对应平台（`android` / `ios`）的 `versions` 数组**最前面**加一条，最新的放第一个；
2. `files` 里每个文件一行：`label` 是按钮上的字，`url` 是下载地址；
3. 提交后一两分钟网站自动更新。旧版本自动出现在“历史版本”里。

`url` 留空的按钮显示“即将开放”。首屏的两个下载按钮会自动指向各平台最新版的第一个文件。

## 换图

- 应用截图在 `img/`，同名覆盖即可。
- 翻译对比用的是示意漫画 `img/translate-before.svg`、`img/translate-after.svg`。
  要换成真机截图：把两张同尺寸的图放进 `img/`，改 `index.html` 里 `id="translate"` 一节的两个 `src`，
  以及 `.compare` 的 `aspect-ratio`，并把图下面的“示意图”说明改掉。
  官网是公开页面，请选全年龄、不带第三方水印的内容。
