var express = require('express');
var config = require('../config/config')
var web_app = express();
var http = require('http').Server(web_app);
var render = require("../renderer");
var {remote} = require('electron');
var url = require('url');
var fs = require('fs');
var pug = require('pug');
const path = require('path');
var themeC = require('../modules/theme');
var server;
var data, objData, uptimeC, timeC, theme, notificaitonInfos;
var notiIndex = 0, socketUsers = [];
var io;

var start = function () {
  server = web_app.listen(6583, function () {
    console.log('App listening on port 6583!')
    var webcontent = remote.getCurrentWebContents()
    if(webcontent)
      webcontent.executeJavaScript("document.getElementById('url-link').innerHTML = \"URL: http://localhost:6583\";")
  })

  io = require('socket.io').listen(server);

  web_app.use(express.static( __dirname + '/static'))
  web_app.set('views', __dirname + '/views')
  web_app.set('view engine', 'pug')

  web_app.get('/', function (req, res) {
    if(fs.existsSync(config.filePath)){
      console.log(config.filePath)  
      fs.readFile(config.filePath, function(err, data){
        if(err) throw err
        objData = JSON.parse(data);
        uptimeC = 15000;
        theme = objData.config.theme;
        timeC = objData.config.timedifferencebtwnoti || 60000;
        notificaitonInfos = objData.notifications;
        var option = { css: "", uptime: uptimeC, 
          configInput: themeC.getThemeConfig(theme.config).input
        }
        // message()
        if(theme.type = "default"){
          option.css = "css/themes/" + theme.name + ".css"
          res.render("themes/" + theme.name, option)
        } else {
          var themePath = path.join(theme.folder, theme.name, theme.name);
          option.css = "/localimage?loc=" + themePath + ".css"
          console.log(themePath);
          res.send(pug.renderFile(themePath + ".pug", option))
        }
        //res.render(theme, { notificaitonInfos: objData.notifications, theme: theme, uptime: uptimeC, time: timeC})
      })
    } else
      res.status(404).end()
  })
  
  io.on('connection', function(socket){
    console.log('a user connected', socket.id)
    checkNotiInfo(function(){
      message(socket);
    })

    socket.on("disconnect", () => {
      console.log('a user disconnect', socket.id);
    })
  });

  web_app.get("/localimage", function(req, res){
    var url_parts = url.parse(req.url, true)
    var query = url_parts.query

    var loc = query.loc
    if(fs.existsSync(loc))
      res.sendFile(loc)
    else
      res.status(404).end()
  })
}
var checkNotiInfo = function(callback){
  if(notificaitonInfos)
    callback()
  else
    setTimeout(checkNotiInfo, 100);
}

var message = function(socket, index = 0){
  if(socket.connected){
    var msg = { data: notificaitonInfos[index] }
    console.log(index)
    index = (index == notificaitonInfos.length - 1) ? 0 : index + 1;
    socket.emit('new notification', msg);
    timeC = timeC || 60000;
    setTimeout(function(){
      message(socket, index)
    }, timeC);
  }
}

var stop= function(){
  if(server){
    server.close(function(){
      console.log('Server stoped.');
    });
  }
}
var restart= function(){
  server.close(function(){
    console.log('Server stoped.');
    start();
  });
}

module.exports = {
  start: start,
  stop: stop,
  restart: restart
};
