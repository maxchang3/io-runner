# IO Runner <sub>**WIP⚠️**</sub>

[简体中文](./README_CN.md)

<a href="https://marketplace.visualstudio.com/items?itemName=antfu.ext-name" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.ext-name.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a> 

Simplifies single-file code execution in VSCode.

* [x] Execute single-file code quickly.
* [x] Redirects input/output to separate views.
* [x] Execute launch configurations from `launch.json` and tasks from `tasks.json`.
* [x] Support [VSCode's configuration variables](https://code.visualstudio.com/docs/editor/variables-reference) in configuration. (Not fully [implemented](https://github.com/connor4312/vscode-variables)).
* [x] Automatically choose launch configurations based on file extensions, maintaining independent context environments for each file(non-persistent storage).
* [x]  Automatically adapts to any theme in VSCode via CSS variables for better native compatibility.
* [ ] more...

This extension may still have the following issues to be resolved:

* [ ] Due to executing native tasks in VSCode, it is significantly slower than running commands directly.
    * Consider manually executing tasks by parsing the task configuration.
* [ ] CodeMirror has been introduced as an editor, but it seems unnecessary.
    * Consider simulating some features through a textarea would suffice, but for large texts, a virtual view/line number mechanism needs to be implemented.
    * Pray that VSCode provides Webview with the ability to use native editors.
* [ ] The pause mechanism for file execution is not elegant enough.

## Configuration Guide

Currently, this extension is **NOT** ready to use out of the box. It depends on configurations in `launch.json` and tasks specified in `tasks.json`.

### `io-runner.launchMap`

Map file extensions to launch configuration names, for example:

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

### `io-runner.launchInterpreter`

Map the type of launch configuration to the interpreter for interpreted languages, for example:

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
    "node": "node",
}
```

## Examples

### Compiled Languages

For compiled languages, take C/C++ as an example， if you have the following launch configuration:

```jsonc
{
    "type": "lldb",
    "request": "launch",
    "name": "(lldb) Launch", // The value of name here corresponds to the value in launchMap below
    "preLaunchTask": "buildG++",
    "postDebugTask": "removeDevFolder",
    "program": "${fileDirname}/.dev/${fileBasenameNoExtension}.out",
    "args": [],
    "cwd": "${fileDirname}",
}
```

You need to add the following to io-runner.launchMap:

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

When you open the IO Runner panel in a C/C++ file, you can choose `(lldb) Launch` to start the process. The e x t en si o n will automatically execute the `buildG++` task (preLaunchTask), then run the output file specified in the program field. Finally, it will execute the `removeDevFolder` task (postDebugTask).


### Interpreted Languages

For languages that require an interpreter, such as Python, you have the following in `launch.json`:

```jsonc
{
    "type": "python", // The value of type here corresponds to the key of the interpreter below
    "request": "launch",
    "name": "Python: Current File",
    "program": "${file}",
    "console": "integratedTerminal"
}
```

You still need to configure in `io-runner.launchMap`:

```jsonc
"io-runner.launchMap": {
    "py": [ "Python: Current File" ],
}
```

Also, You need to configure in `io-runner.launchInterpreter` with the interpreter command matching the type field:

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
}
```

Now, in a Python file, when you open the IO Runner panel, you can choose `Python: Current File` to start. The extension will automatically execute the python3 command, running the current file.

## Commands

* `io-runner.run` - Execute the current file
* `io-runner.stop` - Stop the current execution
* `io-runner.panel.focus` - Focus on the IO Runner panel

You can increase efficiency by binding these commands to shortcut keys.

## Related Project

The project is heavily inspired by [CmdBlockZQG](https://github.com/CmdBlockZQG/)'s [OI Runner](https://github.com/CmdBlockZQG/oi-runner/).

Some components and [design tokens](https://www.fast.design/docs/design-systems/design-tokens/) are from [vscode-webview-ui-toolkit](https://github.com/microsoft/vscode-webview-ui-toolkit) to maintain a consistent appearance with VSCode's interface.

I employ [microsoft/fast](https://github.com/microsoft/fast) to develop the frontend interface for its lightweight design, seamlessly integrated with vscode-webview-ui-toolkit's components.

## License

[MIT](https://github.com/maxchang3/io-runner/blob/main/LICENSE) License © 2023 [maxchang3](https://github.com/maxchang3)

This project is initialized by using the template [starter-vscode](https://github.com/antfu/starter-vscode).
