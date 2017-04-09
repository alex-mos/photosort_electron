const electron = require('electron')

electron.app.on('ready', function () {
  let mainWindow = new electron.BrowserWindow({
    width: 440,
    height: 800
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})
