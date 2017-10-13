var notification = document.querySelector(".info");
var data = {};
var socket = io();
var wait = false;
var msgstack = [];

socket.on('new notification', function(msg){
    if(msg)
        data = msg.data
        if(!wait && msgstack.length == 0)
            showNotification(10000, data)
        else
            msgstack.push(data)
});

function showNotification(uptime, data){
    if(notification){
        wait = true;
        uptime = uptime || 10000;
        notification.querySelector(".image img").src = data["Logo"];
        notification.querySelector(".title").innerText = data["Title"];
        notification.querySelector(".sub-title").innerText = data["Sub-Title"];
        notification.classList.add("show");
        notification.classList.add("animate-in");
        setTimeout(function(){
            notification.classList.remove("animate-in");
        }, 375);
        setTimeout(function(){
            notification.classList.add("animate-out");
            setTimeout(function(){
                notification.classList.remove("animate-out");
                notification.classList.remove("show");
                wait = false;
                setTimeout(function(){
                    if(msgstack.length > 0)
                        showNotification(10000, msgstack.shift());
                }, 100);
            }, 375);
        }, uptime);
    }
}