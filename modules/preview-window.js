const {BrowserWindow} = require('electron').remote
var previewWin = null;

function openPreviewWin(){
    if(previewWin == null){
        previewWin = new BrowserWindow({
            width: 600,
            height: 400,
            title: "Stream Notification - Preview"
        })
        previewWin.loadURL("http://localhost:6583")
        previewWin.setMenu(null);
        
        previewWin.on('closed', function () {
            previewWin = null
        })
    } else {
        previewWin.focus()
    }
}

function reloadPreviewWin(){
    if(previewWin){
        console.log(previewWin.location)
        previewWin.reload()
    }
}

function closePreviewWin(){
    if(previewWin)
        previewWin.close()
}

module.exports = {
    openPreviewWin,
    reloadPreviewWin,
    closePreviewWin
}