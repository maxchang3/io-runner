# IO Runner <sub>**WIP⚠️**</sub>

<a href="https://marketplace.visualstudio.com/items?itemName=antfu.ext-name" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.ext-name.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a> 

VSCode extension simplifies single-file code execution.

* [x] Execute single-file code quickly.
* [x] Redirects input/output to separate views.
* [x] Execute launch configurations from `launch.json` and tasks from `tasks.json`.
* [x] Support [variables](https://code.visualstudio.com/docs/editor/variables-reference) in configuration. (Not fully [implemented](https://github.com/DominicVonk/vscode-variables))
* [x] Choose launch configurations based on file extensions, restore output/input history (non-persistent storage).
* [ ] more...

## Configuration Guide

Currently, this plugin is not ready to use out of the box. It depends on configurations in `launch.json` and tasks specified in `tasks.json`.

### `io-runner.launchMap`

Map file extensions to launch configuration names, for example:

```jsonc
"io-runner.launchMap": {
    "c": [ "(lldb) Launch" ],
    "cpp": [ "(lldb) Launch" ]
}
```

### `io-runner.launchInterpreter`

(For interpreted languages) Map the type of launch configuration (`type`) to the interpreter, for example:

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
    "node": "node",
}
```

## Examples

### Compiled Languages

If you have the following launch configuration:

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

When you open the IO Runner panel in a C/C++ file, you can choose `(lldb) Launch` to start the process. The plugin will automatically execute the `buildG++` task (preLaunchTask), then run the output file specified in the program field. Finally, it will execute the `removeDevFolder` task (postDebugTask).


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

And configure in `io-runner.launchMap`:

```jsonc
"io-runner.launchMap": {
    "py": [ "Python: Current File" ],
}
```

Also, configure in `io-runner.launchInterpreter` with the interpreter command matching the type field:

```jsonc
"io-runner.launchInterpreter": {
    "python": "python3",
}
```

Now, in a Python file, when you open the IO Runner panel, you can choose `Python: Current File` to start. The plugin will automatically execute the python3 command, running the current file.

## Commands

* `io-runner.run` - Execute the current file
* `io-runner.stop` - Stop the current execution
* `io-runner.panel.focus` - Focus on the IO Runner panel

You can increase efficiency by binding these commands to shortcut keys.

## Related Project

The project is heavily inspired by [CmdBlockZQG](https://github.com/CmdBlockZQG/)'s [OI Runner](https://github.com/CmdBlockZQG/oi-runner/).

## License

[MIT](https://github.com/maxchang3/io-runner/blob/main/LICENSE) License © 2023 [maxchang3](https://github.com/maxchang3)

This project is initialized by using the template [starter-vscode](https://github.com/antfu/starter-vscode).
