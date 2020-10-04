<h1 align="center">
  <br>
  <a href="https://arnovandervegt.github.io/wheel/site/ide/ide.html"><img src="https://arnovandervegt.github.io/wheel/assets/icons/png/128x128.png" alt="Wheel" width="128"></a>
  <br>
  Wheel
  <br>
</h1>

<p align="center">
  <a href="https://travis-ci.org/ArnoVanDerVegt/wheel">
    <img src="https://travis-ci.org/ArnoVanDerVegt/wheel.svg?branch=develop" alt="Build Status">
  </a>  
  <a href="https://github.com/ArnoVanDerVegt/wheel/blob/master/license.txt">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="License">
  </a>  
</p>

<h4 align="center">
  An IDE, Compiler and Virtual machine to control Powered Up or EV3 robots.
</h4>

<p align="center">
  <img src="images/screenshot03.png"/>
</p>

<p align="center">
  Try the <a href="http://arnovandervegt.github.io/wheel/site/ide/ide.html">Online demo</a> or 
  <a href="https://arnovandervegt.github.io/wheel/site/docs/index.html">View the documentation</a>.
</p>

## IDE Features

- Highlight source code editor
- Code completion
- Code hints
- Breakpoints
- Debugger, variable inspector
- Image editor
- Sound editor
- Direct motor control
- Works with standard EV3 firmware!
- EV3 File browser
- Help files

## Language features

- Text based language
- Procedural
- Number, struct, string and pointer types
- Include files

## Simulator features

- Direct motor control
- EV3 Display
- View motor status
- View sensor status
- Simulate sensor input
- Read button input
- Connect to brick
- Connect to Powered Up
- Supports daisy chaining

## NodeJS

The NodeJS version can be started with the following command: `$ node server.js`.
The NodeJS version only supports PoweredUp.

## Electron

The electron version can be started with the command: `npm start`.

## Tools

The tools to pack all files can be found in the `tools` directory:

- Update images: `$ node images.js`
- Update template files: `$ node template.js`
- Pack and minifiy the js and css files: `$ node template.js`
