// Modules to control application life and create native browser window
const app                = require('electron').app;
const os                 = require('os');
const electronMainWindow = require('./js/electron/mainWindow');

// Cache code...
require('v8-compile-cache');

// Keep a global reference of the window object, if you don't, the window will
// Be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//global.electronApp = app;

// This method will be called when Electron has finished
// Initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on(
    'ready',
    function() {
        mainWindow = electronMainWindow.createMainWindow(app);
    }
);

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
            mainWindow = electronMainWindow.createMainWindow(app);
        }
    }
);

// In this file you can include the rest of your app's specific main process
// Code. You can also put them in separate files and require them here.
