const BrowserWindow = require('electron').BrowserWindow;
const ipcMain       = require('electron').ipcMain;
const path          = require('path');

exports.createVMWindow = function(app) {
    // Create the browser window.
    let vmWindow = new BrowserWindow({
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
    // And load the index.html of the app.
    vmWindow.loadFile('html/vm.html');
    // Open the DevTools.
    // MainWindow.webContents.openDevTools()
    // Emitted when the window is closed.
    vmWindow.on(
        'closed',
        function() {
            // Dereference the window object, usually you would store windows
            // In an array if your app supports multi windows, this is the time
            // When you should delete the corresponding element.
            vmWindow = null;
        }
    );
    vmWindow.webContents.openDevTools();
    return vmWindow;
};
