gists-cli
=========

Simple gists cli that allows you to find your gists quickly

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/gists-cli.svg)](https://npmjs.org/package/gists-cli)
[![Downloads/week](https://img.shields.io/npm/dw/gists-cli.svg)](https://npmjs.org/package/gists-cli)
[![License](https://img.shields.io/npm/l/gists-cli.svg)](https://github.com/fernandovbs/gists-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g gists-cli
$ gists COMMAND
running command...
$ gists (-v|--version|version)
gists-cli/0.0.1 linux-x64 node-v12.18.1
$ gists --help [COMMAND]
USAGE
  $ gists COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`gists config`](#gists-config)
* [`gists find [SEARCH]`](#gists-find-search)
* [`gists help [COMMAND]`](#gists-help-command)

## `gists config`

Set auth information

```
USAGE
  $ gists config

DESCRIPTION
  ...
  Generates .gists-cli.json to store the access token.
```

_See code: [src/commands/config.js](https://github.com/fernandovbs/gists-cli/blob/v0.0.1/src/commands/config.js)_

## `gists find [SEARCH]`

List gists based on a search string

```
USAGE
  $ gists find [SEARCH]

OPTIONS
  -a, --action=action  Action to take for the selected gist.

DESCRIPTION
  ...
  Prints or edits gists. Options available are print (DEFAULT) and edit.
  Ex: 
  gists find search_string 
  gists find search_string --action=edit
```

_See code: [src/commands/find.js](https://github.com/fernandovbs/gists-cli/blob/v0.0.1/src/commands/find.js)_

## `gists help [COMMAND]`

display help for gists

```
USAGE
  $ gists help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_
<!-- commandsstop -->
