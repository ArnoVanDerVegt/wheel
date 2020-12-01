// Modules to control application life and create native browser window
const app           = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain       = require('electron').ipcMain;
const Menu          = require('electron').Menu;
const path          = require('path');
const os            = require('os');

// Cache code...
require('v8-compile-cache');

// Keep a global reference of the window object, if you don't, the window will
// Be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

global.electronApp = app;

const moveToApplicationsFolder = function() {
        app.moveToApplicationsFolder({
            conflictHandler: function(conflictType) {
                if (conflictType === 'exists') {
                    return dialog.showMessageBoxSync({
                        type:      'question',
                        buttons:   ['Halt Move', 'Continue Move'],
                        defaultId: 0,
                        message:   'An app of this name already exists'
                    }) === 1;
                }
                return true;
            }
        });
    };

const createWindow = function() {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width:  1200,
            height: 800,
            show:   false,
            webPreferences: {
                enableRemoteModule: false,
                allowEval:          false,
                preload:            path.join(__dirname, 'preload.js')
            }
        });
        mainWindow.removeMenu();
        if (process.platform === 'darwin') {
            var menu = Menu.buildFromTemplate([
                    {
                        label: 'Wheel',
                        submenu: [
                            {
                                label:'Exit',
                                click: function() {
                                    app.quit()
                                }
                            }
                        ]
                    }
                ]);
            if (app.isPackaged) {
                Menu.setApplicationMenu(menu);
            }
        } else {
            mainWindow.setMenu(null);
        }
        // And load the index.html of the app.
        mainWindow.loadFile('electron.html');
        mainWindow.on(
            'move',
            (event) => {
                let position = mainWindow.getPosition();
                mainWindow.webContents.send(
                    'postMessage',
                    JSON.stringify({
                        message: 'move',
                        data:    {x: position[0], y: position[1]}
                    })
                );
            }
        );
        mainWindow.on(
            'resized',
            (event) => {
                let position = mainWindow.getPosition();
                let size     = mainWindow.getSize();
                mainWindow.webContents.send(
                    'postMessage',
                    JSON.stringify({
                        message: 'resize',
                        data:    {x: position[0], y: position[1], width: size[0], height: size[1]}
                    })
                );
            }
        );
        // Open the DevTools.
        // MainWindow.webContents.openDevTools()
        // Emitted when the window is closed.
        mainWindow.on(
            'closed',
            function() {
                // Dereference the window object, usually you would store windows
                // In an array if your app supports multi windows, this is the time
                // When you should delete the corresponding element.
                mainWindow = null;
            }
        );
        // mainWindow.webContents.openDevTools();
        ipcMain.on(
            'postMessage',
            function(event, arg) {
                switch (arg.command) {
                    case 'documentPath': // The document path is requested from the preload file!
                        let homedir = (process.platform === 'darwin') ? app.getPath('documents') : os.homedir();
                        event.reply('postMessage', JSON.stringify({message: 'documentPath', data: homedir, isPackaged: app.isPackaged}));
                        break;
                    case 'quit':
                        app.quit();
                        break;
                    case 'console':
                        mainWindow.webContents.openDevTools();
                        break;
                    case 'settings':
                        let settings = arg.settings;
                        if (('windowPosition' in settings) && settings.windowPosition.x && settings.windowPosition.y) {
                            mainWindow.setPosition(settings.windowPosition.x, settings.windowPosition.y);
                        }
                        if ('windowSize' in settings) {
                            mainWindow.setSize(Math.max(settings.windowSize.width, 800), Math.max(settings.windowSize.height, 640));
                        }
                        event.reply(
                            'postMessage',
                            JSON.stringify({
                                message:                'settings',
                                version:                app.getVersion(),
                                isPackaged:             app.isPackaged,
                                isInApplicationsFolder: (process.platform === 'darwin') ? app.isInApplicationsFolder() : true
                            })
                        );
                        mainWindow.show();
                        break;
                    case 'moveToApplicationsFolder':
                        moveToApplicationsFolder();
                        break;
                }
            }
        );
    };

// This method will be called when Electron has finished
// Initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on(
    'window-all-closed',
    function() {
        // On macOS it is common for applications and their menu bar
        // To stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
);

app.on(
    'activate',
    function() {
        // On macOS it's common to re-create a window in the app when the
        // Dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow();
        }
    }
);

// In this file you can include the rest of your app's specific main process
// Code. You can also put them in separate files and require them here.
