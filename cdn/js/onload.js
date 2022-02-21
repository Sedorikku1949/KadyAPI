function loadProperties() {
  if (!document.getElementById("notifications-container"))
    document.getElementsByTagName("body")[0].innerHTML += '<div id="notifications-container"></div>';
  
  console.log("\x1b[32mNotifications: Loaded\x1b[0m");
  console.log("\x1b[32mReady to use\x1b[0m");
}

window.onload = loadProperties;