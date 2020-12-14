const app           = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const ipcMain       = require('electron').ipcMain;
const path          = require('path');
const ipcRenderer   = require('electron').ipcRenderer;

let vmWindow = null;

exports.isOpen = function() {
    return !!vmWindow;
};

exports.createVMWindow = function() {
    vmWindow = new BrowserWindow({
        width:  640,
        height: 480,
        show:   true,
        webPreferences: {
            enableRemoteModule: false,
            allowEval:          false,
            preload:            path.join(__dirname, './vmWindowPreload.js')
        }
    });
    vmWindow.setResizable(false);
    vmWindow.removeMenu();
    vmWindow.loadFile('html/vm.html');
    vmWindow.on(
        'close',
        function(event) {
            vmWindow = null;
            const mainWindow = require('./mainWindow');
            if (!mainWindow.isOpen()) {
                app.quit();
            }
        }
    );
    ipcMain.on(
        'postMessage',
        function(event, arg) {
            switch (arg.command) {
                case 'vmWindowResize':
                    vmWindow.setSize(arg.width, arg.height);
                    break;
            }
        }
    );
    // Open the DevTools.
    // VmWindow.webContents.openDevTools()
};
