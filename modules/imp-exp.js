const fs = require('fs')
const config = require("../config/config")
var {remote} = require('electron')
const dialog = remote.dialog

var exportFile = function(callback){
    dialog.showSaveDialog({ filters: [
            { name: 'json', extensions: ['json'] }
        ]}, function (fileName) {
        if (fileName === undefined) return;
        if(fs.existsSync(config.filePath)){
            fs.readFile(config.filePath, function(err, data){
                if(err) throw err
                fs.writeFile(fileName, data, function (err) {   
                    if(err) throw err
                    if (callback) callback()
                })
            })
        }
    })
}

var importFile = function(callback){
    dialog.showOpenDialog({ filters: [
            { name: 'json', extensions: ['json'] }
        ]}, function (fileNames) {
        if (fileNames === undefined) return;
        var fileName = fileNames[0];
        if(fs.existsSync(fileName)){
            fs.readFile(fileName, function(err, data){
                if(err) throw err
                fs.writeFile(config.filePath, data, function (err) {   
                    if(err) throw err
                    if (callback) callback();
                })
            })
        }
    })
}

module.exports = {
    exportFile: exportFile,
    importFile: importFile
}