# IO Runner <sub>**WIP⚠️**</sub>

<a href="https://marketplace.visualstudio.com/items?itemName=antfu.ext-name" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.ext-name.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a> 

简化单文件代码执行的 VSCode 插件。

* [x] 快速执行单文件代码
* [x] 重定向输入输出到独立的视图。
* [x] 执行 `launch.json` 中的启动项和 `tasks.json` 中的任务。
* [x] 支持 VSCode 配置文件的[变量](https://code.visualstudio.com/docs/editor/variables-reference)  (并非完整[实现](https://github.com/DominicVonk/vscode-variables))
* [x] 根据文件后缀选择启动项，恢复输出/输出记录（非持久化存储）。
* [ ] more...

## 配置说明

目前，此插件并不是开箱即用的。它依赖于 `launch.json` 中的配置和 `tasks.json` 中指定的任务。

### `io-runner.launchMap`

映射文件后缀和启动配置名称，例如：

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

### `io-runner.launchInterpreter`

（对于解释型语言）映射启动项的类型（type）与解释器，例如：

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
    "node": "node",
}
```

### 实例

#### 编译型语言

如果你有如下启动配置：

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

当你在 C/C++ 文件中打开 IO Runner 面板时，你可以选择 `(lldb) Launch` 来启动进程。插件会自动执行 `buildG++` 任务（preLaunchTask），然后运行 `program` 字段中指定的输出文件。最后，它会执行 `removeDevFolder` 任务（postDebugTask）。

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

并且在 `io-runner.launchMap` 中配置：

```jsonc
"io-runner.launchMap": {
    "py": [ "Python: Current File" ],
}
```

还需要在 `io-runner.launchInterpreter` 中配置与 `type` 项相符的解释器命令，例如：

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
}
```

那么在 Python 文件中，打开了 IO Runner 面板，你就可以选择 `Python: Current File` 进行启动。插件会自动执行 `python3` 命令，运行当前文件。

## 命令

- `io-runner.run` - 执行当前文件
- `io-runner.stop` - 停止当前执行
- `io-runner.panel.focus` - 聚焦 IO Runner 面板

可以通过绑定快捷键增加执行效率。

## 相关项目

此项目大程度地受到 [CmdBlockZQG](https://github.com/CmdBlockZQG/) 的 [OI Runner](https://github.com/CmdBlockZQG/oi-runner/) 启发。

## License

[MIT](https://github.com/maxchang3/io-runner/blob/main/LICENSE) License © 2023 [maxchang3](https://github.com/maxchang3)

This project is initialized by using the template [starter-vscode](https://github.com/antfu/starter-vscode).