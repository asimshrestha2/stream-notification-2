var notification;
var data = [
	{
		"title": "@Asim_Shrsth",
		"sub-title": "Follow Me on Instragram",
		"image-location": "/localimage?loc=D:/3D/balloon/balloon_sq.png"
	},
	{
		"title": "asim.shrestha",
		"sub-title": "Follow Me on Facebook",
		"image-location": "imgs/logos/facebook.svg"
	},
	{
		"title": "@Asim_Shrsth",
		"sub-title": "Follow Me on Twitter",
		"image-location": "imgs/logos/twitter.svg"
	}
];
var index = 0;

function showNotification(uptime, time){
    if(notification){
        uptime = uptime || 10000;
        time = time || 15000;
        notification.querySelector(".image img").src = data[index]["image-location"];
        notification.querySelector(".title").innerText = data[index]["title"];
        notification.querySelector(".sub-title").innerText = data[index]["sub-title"];
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
                if (index < (data.length - 1)) { index++; } else { index = 0; }
                setTimeout(function(){
                    showNotification(uptime, time);
                }, time);
            }, 375);
        }, uptime);
    }
}