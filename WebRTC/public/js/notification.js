
function checkNotification() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
  }
}


function notifyMe(){
     if (Notification.permission === "granted") {
        var options = {
              body: "You get a help request from Ninja.",
              icon: "../img/ninja.png",
              dir : "ltr"
          };
        var notification = new Notification("Hi there",options);
      }
}