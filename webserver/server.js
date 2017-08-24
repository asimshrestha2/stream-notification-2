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
var server;
var data;

var start = function () {
  // var themes = getThemes();
  // getdThemes()
  server = web_app.listen(6583, function () {
    console.log('App listening on port 6583!')
    // render.clientMessage("Go to http://localhost:6583 for the Notification")
    var webcontent = remote.getCurrentWebContents()
    if(webcontent)
      webcontent.executeJavaScript("document.getElementById('url-link').innerHTML = \"URL: http://localhost:6583\";")
  })

  web_app.use(express.static( __dirname + '/static'))
  web_app.set('views', __dirname + '/views')
  web_app.set('view engine', 'pug')

  web_app.get('/', function (req, res) {
    if(fs.existsSync(config.filePath)){
      console.log(config.filePath)  
      fs.readFile(config.filePath, function(err, data){
        if(err) throw err
        var objData = JSON.parse(data)
        var uptimeC = 15000;
        var theme = objData.config.theme;
        var timeC = objData.config.timedifferencebtwnoti || 60000;
        var option = {
          notificaitonInfos: objData.notifications, 
          css: "", 
          uptime: uptimeC, 
          time: timeC
        }
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
    //res.sendFile(__dirname + '/views/index.html')
  })

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
