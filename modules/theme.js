const path = require("path")
const fs = require("fs")
const config = require("../config/config")
const themeConfigDir = path.join(__dirname, "theme", "theme-config") 
var themeConfig

var getDefaultThemes = function(){
    return JSON.parse(fs.readFileSync(path.join(__dirname, "theme", "defaultThemes.json")))
}

var getThemes = function(){
    var themeASFolder = path.join(__dirname, "../webserver/themes/")
    var themeFolder = config.themeFolder
    if(!getThemeFromFolder(themeFolder)){
        return getDefaultThemes()
    } else {
        return getDefaultThemes().concat(getThemeFromFolder(themeFolder, "custom"))
    }
}

var getThemeConfig = function(config){
    if(config){
        if(themeConfig && themeConfig.name == config)
            return themeConfig
        else
            themeConfig = JSON.parse(fs.readFileSync(path.join(themeConfigDir, config + ".json")))
    } else {
        themeConfig = JSON.parse(fs.readFileSync(path.join(themeConfigDir, "default.json")))
    }
    return themeConfig
}

var getHTMLForConfig = function(inputs){
    var html = ""

    if(inputs){
        inputs.forEach((item)=>{
            switch (item.type) {
                case "text":
                    html += `<div class="notification-data"> 
                            <div class="title">${item.name}:</div> 
                            <input type="text" class="noti-${item.name.toLowerCase()}" placeholder="${item.name}">
                            </div>`
                    break;
                case "image":
                    html += `<div class="notification-data"> 
                            <div class="title">${item.name}:</div>
                            <div class="check"><input type="checkbox" class="noti-image-type">Local Path</div>
                            <input type="text" class="noti-${item.name.toLowerCase()}" placeholder="Local Path or URL">
                            </div>`
                    break;
                default:
                    break;
            }
        })
    }

    return `<div class="notificaiton-info">${html}</div>`.trim()
}

var getThemeFromFolder = function(folderName, type){
    if(fs.existsSync(folderName)){
        var themes = new Array()
        fs.readdirSync(folderName).forEach((item) => {
            themes.push({
                "name": item,
                "type": type,
                "folder": folderName
            })
        })
        return themes
    } else {
        console.log(folderName + " Folder Missing.")
        return null
    }
}

var findTheme = function(themes, name){
    for(var i = 0; i < themes.length; i++){
        if(themes[i].name === name){
            return themes[i];
        }
    }
}

module.exports = {
    getThemes: getThemes,
    getThemeFromFolder: getThemeFromFolder,
    getThemeConfig: getThemeConfig,
    getHTMLForConfig: getHTMLForConfig,
    findTheme: findTheme
}