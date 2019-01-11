const {app, BrowserWindow} = require('electron');
const Store = require('electron-store');
const store = new Store();
let mainWindow;
let bounds = {x:null, y:null, width:1920, height:1080};

function createWindow () {
    
    // Check for Saved Bounds 
    if (typeof store.get('config') !== 'undefined' && typeof store.get('config').bounds !== 'undefined' && store.get('config').bounds !== null) {
        bounds = store.get('config').bounds;
    }

    if (process.platform === "win32") {
        cwd = __dirname.replace('src\\js', '');
        ico = cwd+"src/icons/icon.png"; 
    } else {
        cwd = __dirname.replace('src/js', '');
        ico = cwd+"src/icons/icon.png";
    } 
    
    const windowConfig = {
        icon:ico,
        width:bounds.width, 
        height:bounds.height, 
        x:bounds.x, 
        y:bounds.y, 
        minWidth:50, 
        minHeight:50, 
        menu:null,
        toolbar:false, 
        webPreferences:{nodeIntegration:true}
    };

    mainWindow = new BrowserWindow(windowConfig);
    mainWindow.setMenu(null);

    // Our Controller FIle
    mainWindow.loadFile('src/views/index.view.html');

    // Track Movement and Resize
    mainWindow.on('resize', trackWindow);
    mainWindow.on('move', trackWindow);

    // Save our Window Bounds for Next Session
    mainWindow.on('closed', function () {

        // Save Bounds on Exit
        const config = store.get('config');
        config.bounds = bounds;
        store.set('config', config);

        mainWindow = null;

    });
    
}

function trackWindow() {
    bounds = mainWindow.getBounds();
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



