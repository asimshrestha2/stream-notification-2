const path = require("path")
const fs = require("fs")
const config = require("../config/config")

var defaultThemes = [
    {
        name: "theme1",
        type: "default"
    },
    {
        name: "theme2",
        type: "default"
    },
    {
        name: "theme3",
        type: "default"
    },
    {
        name: "theme4",
        type: "default"
    },
    {
        name: "theme5",
        type: "default"
    }
]

var getThemes = function(){
    var themeASFolder = path.join(__dirname, "../webserver/themes/")
    var themeFolder = config.themeFolder
    if(!getThemeFromFolder(themeFolder)){
        return defaultThemes
    } else {
        return defaultThemes.concat(getThemeFromFolder(themeFolder, "custom"))
    }
}

var getThemeFromFolder = function(folderName, type){
    if(fs.existsSync(folderName)){
        var themes = new Array()
        fs.readdirSync(folderName).forEach( (item) => {
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
    findTheme: findTheme
}