const os = require('os')
const path = require('path')

module.exports = {
    htmlNotiInfo: "<div class=\"notificaiton-info\">" +
        "<div class=\"notification-data\"><div class=\"title\">Title:</div><input type=\"text\" class=\"noti-title\" placeholder=\"Title\"></div>" +
        "<div class=\"notification-data\"><div class=\"title\">Sub-Title:</div><input type=\"text\" class=\"noti-sub-title\" placeholder=\"Sub-title\"></div>" +
        "<div class=\"notification-data\"><div class=\"title\">Logo:</div><div class=\"check\"><input type=\"checkbox\" class=\"noti-image-type\">"+
        " Local Path</div><input type=\"text\" class=\"noti-image-location\" placeholder=\"Local or URL\"></div>" +
    "</div>",
    filePath: path.join(process.env.APPDATA, "/stream-notification-2/data.json"),
    folderPath: path.join(process.env.APPDATA, "/stream-notification-2/"),
    localFileUrl: "/localimage?loc=",
    themeFolder: path.join(os.homedir(), "/stream-notification/theme/") 
}
