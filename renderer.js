const express_app = require("./webserver/server");
const config = require("./config/config")
const theme = require("./modules/theme")
const impExp = require("./modules/imp-exp")
const fs = require("fs");
const previewWin = require("./modules/preview-window")

var data = {};
var totalnotifications = document.getElementById("total-notifications");
var timedifferencebtwnoti = document.getElementById("time-difference-notifications");
var editNotification = document.querySelector(".content .edit-noifications");
var messageLog = document.getElementById('message-log');
var selectTheme = document.getElementById("theme");
var themes, currentTheme;

function addHtmlNotiInfo(num){
    if(num){
        editNotification.innerHTML = "";
        for(var i = 0; i < num; i++){
            editNotification.innerHTML += config.htmlNotiInfo;
        }
    }
}

function saveDataToFile(){
    if(editNotification){
        saveData();
        var filePath = config.filePath;
        var folderPath = config.folderPath;
        if(!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath)

        fs.writeFile(filePath, JSON.stringify(data, null, "\t"), 'utf8', function (err) {
            if (err) {
                clientMessage("Error Saving", "#ff0000", 2000);
                return console.log(err);
            }
            clientMessage("Data saved!");
            previewWin.reloadPreviewWin();
        });
    }
}

function saveData(){
    if(editNotification){
        var notificationInfo = editNotification.getElementsByClassName("notificaiton-info");
        data = {
            config: { 
                "totalNotifications": totalnotifications.value,
                "timedifferencebtwnoti": (timedifferencebtwnoti.value * 60 * 1000),
                "theme": theme.findTheme(themes, selectTheme.value)
            },
            notifications: []
        };
        for(var i = 0; i < notificationInfo.length; i++){
            var crtNotificationInfo = notificationInfo[i];

            var imageLocation = crtNotificationInfo.querySelector(".noti-image-location").value;
            if(crtNotificationInfo.querySelector(".noti-image-type").checked){
                imageLocation = config.localFileUrl + imageLocation.replace(/\\/g, "/");
            }

            data.notifications.push({
                "title": crtNotificationInfo.querySelector(".noti-title").value,
                "sub-title":  crtNotificationInfo.querySelector(".noti-sub-title").value,
                "image-location": imageLocation
            });
        }
    }
}

function loadDataFromFile(){
    if(fs.existsSync(config.filePath)){
        fs.readFile(config.filePath, function(err, d){
            if(err) throw err;
            data = JSON.parse(d);
            // console.log(data);
            totalnotifications.value = data.notifications.length;
            timedifferencebtwnoti.value = Math.round(data.config.timedifferencebtwnoti/60/1000);
            selectTheme.value = data.config.theme.name;
            addHtmlNotiInfo(totalnotifications.value);
            loadData();
        });
    } else {
        addHtmlNotiInfo(totalnotifications.value);
    }
}

function loadData(){    
    if(editNotification){
        var notificationInfo = editNotification.getElementsByClassName("notificaiton-info");
        for(var i = 0; i < notificationInfo.length; i++){
            var crtNotificationInfo = notificationInfo[i];
            if(data.notifications[i]){
                crtNotificationInfo.querySelector(".noti-title").value = data.notifications[i]["title"];
                crtNotificationInfo.querySelector(".noti-sub-title").value = data.notifications[i]["sub-title"];

                var imageLocation = data.notifications[i]["image-location"];
                if(imageLocation.includes(config.localFileUrl)){
                    crtNotificationInfo.querySelector(".noti-image-type").checked = true;
                    imageLocation = imageLocation.replace(config.localFileUrl, "").replace(/\//g, "\\");
                }
                crtNotificationInfo.querySelector(".noti-image-location").value = imageLocation;
            }
        }
    }
}

function loadThemes(){
    themes = theme.getThemes();
    if(themes && selectTheme){
        selectTheme.innerHTML = ""
        themes.forEach( (item) => {
            selectTheme.innerHTML += "<option>" + item.name + "</option>"
            if(item.config)
                console.log(theme.getThemeConfig(item.config))
            else
                console.log(theme.getThemeConfig("default"))
        });
    }
}

function toggleMessageBox(messageBox){
    messageBox.classList.toggle("show");
}

function clientMessage(message, color, time){
    if(messageLog && message){
        color = color || "#FFFF00";
        time = time || 1500;
        messageLog.innerText = message;
        messageLog.style.color = color;
        messageLog.classList.add("show");
        messageLog.classList.add("animate-in");
        setTimeout(function(){
            messageLog.classList.remove("animate-in");
        }, 300);
        setTimeout(function(){
            messageLog.classList.add("animate-out");
            setTimeout(function(){
                messageLog.classList.remove("animate-out");
                messageLog.classList.remove("show");
            }, 300);
        }, time);
    }
}

var setKeyBindings = () => {
    var saveMap = {17: false, 83: false};
    window.addEventListener("keydown", (ev) => {
        saveMap[ev.keyCode] = true;
        if (saveMap[17] && saveMap[83]) {
            saveDataToFile();
        }
    }, true)

    window.addEventListener("keyup", (ev) => {
        if(ev.keyCode in saveMap)
            saveMap[ev.keyCode] = false;
    }, true)
}

document.addEventListener("DOMContentLoaded", function(){
    totalnotifications.value = totalnotifications.getAttribute("min");
    timedifferencebtwnoti.value = timedifferencebtwnoti.getAttribute("min");

    data = {
        config: { 
            "totalNotifications": totalnotifications.value,
            "timedifferencebtwnoti": (timedifferencebtwnoti.value * 60 * 1000)
        },
        notifications: []
    };

    loadDataFromFile();
    loadThemes();
    express_app.start();

    document.getElementById("save-data").addEventListener("click", saveDataToFile, false);
    document.getElementById("clear-data").addEventListener("click", function(){
        document.querySelectorAll(".edit-noifications input[type=\"text\"]").forEach(function(item){
            item.value = "";
        });
        document.querySelectorAll(".edit-noifications input[type=\"checkbox\"]").forEach(function(item){
            item.checked = false;
        });
    }, false);
    
    document.getElementById("preview-window").addEventListener("click", previewWin.openPreviewWin, false);
    
    document.getElementById("settings").addEventListener("click", function(){
        toggleMessageBox(document.querySelector(".noti-settings"));
    }, false);
    document.querySelector(".noti-settings .apply-settings").addEventListener("click", function(){
        if(totalnotifications.value > 0 && totalnotifications.value <= 15){
            addHtmlNotiInfo(totalnotifications.value);
            loadData();
            toggleMessageBox(document.querySelector(".noti-settings"));
            clientMessage("Setting Saved");
            saveDataToFile();
        } else {
            clientMessage("Total Notifications can be from 1 to 15.");
        }
    }, false);
    document.querySelector(".noti-settings .import-settings").addEventListener("click", function(){
        impExp.importFile(function(){
            loadDataFromFile();
        });
        toggleMessageBox(document.querySelector(".noti-settings"));
    }, false);

    
    document.querySelector(".noti-settings .export-settings").addEventListener("click", function(){
        saveDataToFile();
        impExp.exportFile();
        toggleMessageBox(document.querySelector(".noti-settings"));
    }, false);
    
    document.querySelector(".noti-settings .close-settings").addEventListener("click", function(){
        toggleMessageBox(document.querySelector(".noti-settings"));
    }, false);

    // document.getElementById("start-server").addEventListener("click", function(){
    //     saveDataToFile();
    //     express_app.start();
    //     clientMessage("Server Started");
    // }, false);
    document.getElementById("restart-server").addEventListener("click", function(){
        express_app.restart();
        clientMessage("Server Restarted");
    }, false);

    setKeyBindings();
});