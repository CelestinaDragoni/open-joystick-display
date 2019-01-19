const {app, BrowserWindow} = require('electron');
let mainWindow;

// Fixes it for Windows 10, noticed much more stable performance in OBS Linux as well.
// Since the engine is only rendering 2D, hardware acceleration isn't required.
// Will move elsewhere prior to 1.0 Final
app.disableHardwareAcceleration();

function createWindow () {
    
    if (process.platform === "win32") {
        cwd = __dirname.replace('src\\js', '');
        ico = cwd+"src/icons/icon.png"; 
    } else {
        cwd = __dirname.replace('src/js', '');
        ico = cwd+"src/icons/icon.png";
    } 
    
    const windowConfig = {
        icon:ico,
        width:0, 
        height:0, 
        x:0, 
        y:0, 
        minWidth:50, 
        minHeight:50, 
        menu:null,
        toolbar:false, 
        webPreferences:{nodeIntegration:true}
    };

    mainWindow = new BrowserWindow(windowConfig);
    mainWindow.toggleDevTools();
    mainWindow.setMenu(null);

    // Our Controller FIle
    mainWindow.loadFile('app/views/index.view.html');

    
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});



