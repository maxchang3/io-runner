# IO Runner <sub>**WIP⚠️**</sub>

<a href="https://marketplace.visualstudio.com/items?itemName=maxchang.io-runner" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/maxchang.io-runner.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a> 

![](./res/preview.png)

简化 VSCode 下的单文件代码执行。

* [x] 快速执行单文件代码
* [x] 重定向输入输出到独立视图。
* [x] 执行 `launch.json` 中的启动项和 `tasks.json` 中的任务
* [x] 在配置中支持 [VSCode 的配置变量](https://code.visualstudio.com/docs/editor/variables-reference)。(通过使用 [connor4312/vscode-variables](https://github.com/connor4312/vscode-variables)，并非完整实现。[VSCode 本身不支持](https://github.com/microsoft/vscode/issues/2809))。
* [x] 根据文件扩展名自动选择启动配置，为每个文件保持独立的上下文环境（非持久化存储）。
* [x] 通过 CSS 变量，自动适配 VSCode 的任意主题，更加与原生协调
* [ ] more...

此扩展可能还存在以下问题有待解决：

* [ ] 由于执行 VSCode 的原生任务，这比直接运行命令要慢的多
    - 可能选择通过解析 task 配置手动执行
* [ ] 引入了 CodeMirror 作为编辑器，但是似乎是不必要的
    - 可能通过 textarea 模拟部分特性即可，但是对于大文本需要引入虚拟视图/行号机制
    - 祈求 VSCode 提供 Webview 使用原生编辑器的特性
* [ ] 文件执行的暂停机制不够优雅

## 配置说明

目前，此扩展**并不是**开箱即用的。它依赖于 `launch.json` 中的配置和 `tasks.json` 中指定的任务。

### `io-runner.launchMap`

映射文件后缀和启动配置名称，例如：

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

### `io-runner.launchInterpreter`

对于解释型语言，映射启动项的类型（type）与解释器，例如：

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
    "node": "node",
}
```

### `io-runner.defaultEncoding`

输入输出的默认编码。如果你使用的是非英语的 Windows 系统，你可能需要将其设置为对应系统语言的编码，以显示正确的语言字符。

例如，简体中文用户可能需要将其设置为 `gbk` 。日语用户可能需要将其设置为 `shift_jis` 。

可以设置的值及其说明可以在设置(UI)中直接选择。你也可以查看 [TextDecoder: encoding property](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/encoding) 或 [package.json](https://github.com/maxchang3/io-runner/blob/main/package.json#L36) 获得更详细的内容。

### 实例

为了更好的使用体验，最好在 `tasks.json` 的对应任务中，将 `presentation` 中的 `reveal` 设置为 `slient` 。

```jsonc
     "presentation": {
        "reveal": "never"
      },
```

#### 编译型语言

对于编译型语言，以 C/C++ 为例。如果你有如下启动配置：

```jsonc
{
    "type": "lldb",
    "request": "launch",
    "name": "(lldb) Launch", // 这里的 name 的值对应后面 launchMap 的值
    "preLaunchTask": "buildG++",
    "postDebugTask": "removeDevFolder",
    "program": "${fileDirname}/.dev/${fileBasenameNoExtension}.out",
    "args": [],
    "cwd": "${fileDirname}",
}
```

你需要在 `io-runner.launchMap` 中添加：

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

当你在 C/C++ 文件中打开 IO Runner 面板时，你可以选择 `(lldb) Launch` 来启动进程。此时，扩展会自动执行 `buildG++` 任务（preLaunchTask），然后运行 `program` 字段中指定的输出文件。最后，它会执行 `removeDevFolder` 任务（postDebugTask）。

#### 解释型语言

对于需要解释器的语言，例如 Python，你在 `launch.json` 中有如下项：

```jsonc
{
    "type": "python", // 这里的 type 的值是后面解释器的键值
    "request": "launch",
    "name": "Python: Current File",
    "program": "${file}",
    "console": "integratedTerminal"
}
```

你仍需要在 `io-runner.launchMap` 中配置：

```jsonc
"io-runner.launchMap": {
    "py": [ "Python: Current File" ],
}
```

同时，还需要在 `io-runner.launchInterpreter` 中配置与 `type` 项相符的解释器命令，例如：

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
}
```

那么在 Python 文件中，打开了 IO Runner 面板，你就可以选择 `Python: Current File` 进行启动。扩展会自动执行 `python3` 命令，运行当前文件。

## 命令

* `io-runner.run` - 执行当前文件
* `io-runner.stop` - 停止当前执行
* `io-runner.panel.focus` - 聚焦 IO Runner 面板

可以通过绑定快捷键增加执行效率。

## 致谢

此项目大程度地受到 [CmdBlockZQG](https://github.com/CmdBlockZQG/) 的 [OI Runner](https://github.com/CmdBlockZQG/oi-runner/) 启发。

一些组件和 [design token](https://www.fast.design/docs/design-systems/design-tokens/) 来自 [vscode-webview-ui-toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit)，以保持与 VSCode 界面的一致性。

我采用 [microsoft/fast](https://github.com/microsoft/fast) 开发前端界面。因为它设计轻量，且与 vscode-webview-ui-toolkit 的组件无缝集成。

## License

[MIT](https://github.com/maxchang3/io-runner/blob/main/LICENSE) License © 2023 [maxchang3](https://github.com/maxchang3)

This project is initialized by using the template [starter-vscode](https://github.com/antfu/starter-vscode).
