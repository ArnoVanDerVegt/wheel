<h1 align="center">
  <br>
  <a href="https://arnovandervegt.github.io/wheel/site/ide/ide.html"><img src="https://arnovandervegt.github.io/wheel/assets/icons/png/128x128.png" alt="Wheel" width="128"></a>
  <br>
  Wheel
  <br>
</h1>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/ArnoVanDerVegt/wheel?color=blue" alt="Last commit">
  <a href="https://travis-ci.org/ArnoVanDerVegt/wheel">
    <img src="https://app.codeship.com/projects/582d421b-a5b5-4f7e-9d3c-99e2da0157ac/status?branch=develop" alt="Build Status">
  </a>
  <a href="https://github.com/ArnoVanDerVegt/wheel/blob/master/license.txt">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="License">
  </a>
</p>

<h4 align="center">
  An IDE, Compiler and Virtual machine to control Powered Up or EV3 robots.
</h4>

<p align="center">
  <a href="https://arnovandervegt.github.io/wheel/site/ide/ide.html">Try the Online demo</a> •
  <a href="https://arnovandervegt.github.io/wheel/">Website</a> •
  <a href="https://arnovandervegt.github.io/wheel/site/docs/index.html">View the documentation</a> •
  <a href="https://github.com/ArnoVanDerVegt/wheel/wiki">About Wheel</a>
</p>

<p align="center">
  <img src="https://arnovandervegt.github.io/wheel/images/screenshot03.png"/>
</p>

## About

Wheel is an IDE which allows you to program EV3 and Powered Up robots in a text based language.
The IDE provides several tools to test your robots and debug your programs.

A simulator allows you to view the state of your EV3 or Powered Up devices.
It can display sensor information, motor speeds, motor position.

### IDE Features

- Highlighted source code editor
- Code completion and code hints
- Breakpoints, a debugger, variable inspector
- EV3 Image and sound editor
- Works with standard EV3 firmware!
- EV3 File browser

### Language features

- A simple syntax
- Text based language
- Procedural programming
- Number, struct, string and pointer types
- Include files

### Simulator features

- Direct motor control
- EV3 Display
- View motor status
- View sensor status
- Simulate sensor input
- Read button input
- Connect to an EV3 or to Powered Up
- Supports daisy chaining or multiple Powered Up devices

### Installation

The best way to run the latest version of Wheel is to use the electron version.
To run this version you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/ArnoVanDerVegt/wheel.git

# Go into the repository
$ cd wheel

# Install dependencies
$ npm install
```

#### Electron

The electron version can be started with the command:
```bash
$ npm start
```

#### NodeJS

The NodeJS version only supports PoweredUp and can be started with the following command:
```bash
$ node server.js
```
