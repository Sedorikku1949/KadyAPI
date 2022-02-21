
/* UTILS */


function getValueType(value){
  if ([null, undefined].some((e) => value == e)) return String(value).toLowerCase();
  else return(value.constructor.name.toLowerCase());
};






/* LIGHTBOX */

let lightBoxOpened = false;
let lightBoxOptions = null;


/**
 * 
 * @param {Object} options 
 * @returns {void}
 * 
 * @example
 * options == [
 * ]
 */

let options = [
  { img: "/cdn/img/example-1.png", title: "Title 1" },
  { img: "/cdn/img/example-2.png", title: "Title 2" },
  { img: "/cdn/img/example-3.png", title: "Title 3" },
]

let lightbox = document.getElementById("lightbox-container");

function openLightbox(options) {
  if (lightBoxOpened) throw new Error("Lightbox already opened");
  lightBoxOpened = true;
  if (!document.getElementById("lightbox-container")) document.getElementsByTagName("body")[0].innerHTML += "<div id='lightbox-container' class='inactive-lightbox'></div>";
  if (!Array.isArray(options) || options.some((opt) => Object.values(opt).some((val) => typeof val !== "string"))) throw new Error("Invalid options was provided");
  lightbox = document.getElementById("lightbox-container");
  lightBoxOptions = options;
  lightbox.innerHTML += generateLightBoxContent(options[0].title, options[0].img, 0);  
  document.getElementById("lightbox-container").style["display"] = "block";
  return true;
}

function generateLightBoxContent(title, img, index) {
  return `<div id="lightbox-background"></div><div draggable="false" id="lightbox-content"><div id="lightbox-content-title"><div id="lightbox-content-title-text"><div id="lightbox-close-section" onclick="closeLightbox()"> <img id="lightbox-close" src="/cdn/img/cross.png" draggable="false"/></div><h1>${title}</h1></div></div><img style="left:25px" class="lightbox-arrow" src="/cdn/img/arrowLeft.png" onclick="undoLightBox(${index})" draggable="false" /><img src="${img}" draggable="false" /><img style="right:25px;" class="lightbox-arrow" onclick="redoLightBox(${index})" src="/cdn/img/arrowRight.png" draggable="false" /></div>`
}


function redoLightBox(index) {
  const newData = options[(index+1)%options.length];
  lightbox.innerHTML = generateLightBoxContent(newData.title, newData.img,  ((index+1)%options.length));  
}

function undoLightBox(index){
  const newData = options[(options.length+(index-1))%options.length];
  lightbox.innerHTML = generateLightBoxContent(newData.title, newData.img, (options.length+(index-1))%options.length);  
}

function closeLightbox(){
  if (!lightBoxOpened) throw new Error("Lightbox already closed");
  lightBoxOpened = false;
  document.getElementById("lightbox-container").style["display"] = "none";
  document.getElementById("lightbox-container").innerHTML = "";
  return true;
}









/* NAVBAR */

function openNavBar(){
  document.getElementById("navbar-section").classList.remove("navbar-inactive");
  document.getElementById("navbar-section").classList.add("navbar-active");
  document.getElementById("main").style["display"] = "none";
}

function closeNavBar(){
  document.getElementById("navbar-section").classList.remove("navbar-active");
  document.getElementById("navbar-section").classList.add("navbar-inactive");
  document.getElementById("main").style["display"] = "block";
}

















/* NOTIFICATION */

function randomId() {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
}

function generateUniqueId(){
  let id = randomId();
  while (document.getElementById(id) || notifications.some((n) => n.id == id)) id = randomId();
  return id;
}

let notifications = [];

const notificationsOptions = {
  icons: {
    success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M10.2426 16.3137L6 12.071L7.41421 10.6568L10.2426 13.4853L15.8995 7.8284L17.3137 9.24262L10.2426 16.3137Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" /> </svg>',
    danger: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor" /> <path d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor" /> </svg>',
    error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" fill="currentColor" /> </svg>',
    info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M11 10.9794C11 10.4271 11.4477 9.97937 12 9.97937C12.5523 9.97937 13 10.4271 13 10.9794V16.9794C13 17.5317 12.5523 17.9794 12 17.9794C11.4477 17.9794 11 17.5317 11 16.9794V10.9794Z" fill="currentColor" /> <path d="M12 6.05115C11.4477 6.05115 11 6.49886 11 7.05115C11 7.60343 11.4477 8.05115 12 8.05115C12.5523 8.05115 13 7.60343 13 7.05115C13 6.49886 12.5523 6.05115 12 6.05115Z" fill="currentColor" /> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor" /> </svg>'
  },
  defaultPattern: '<div class="notification notification-default {theme}" id="{id}"> <div class="notification-body"> <p>{message}</p> <div class="cross" onclick="closeNotification({id})"></div> </div> </div>',
  iconPattern: '<div class="notification icon-notification {theme}" id="{id}"> <div class="notification-header"> {icon} <div class="cross" onclick="closeNotification({id})"></div> </div> <div class="notification-body"> <p>{message}</p> </div> </div>',
  modalPattern: '<div class="notification notification-modal" id="{id}"> {svg} <div class="notification-body"> <h3>{question}</h3> <p>{details}</p> <div class="modals-buttons"> {buttons} </div> </div> </div>',
  modalButtonPattern: '<button class="btn {class}" onclick="{onclick}">{message}</button>',
  svgModalDefault: '<svg style="color: rgb(231,76,60)" width="48" height="48" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
}

function generateNotificationString(theme, options, id){
  console.log(theme)
  console.log(options)
  let template = "";
  if (options.type == "default") template = notificationsOptions.defaultPattern;
  else if (options.type == "icon") template = notificationsOptions.iconPattern;
  else if (options.type == "modal") template = notificationsOptions.modalPattern;
  return template.replace(/{(?:message|text|id|theme|class|details|question|buttons|icon|svg)}/g, (m, _) => {
    switch(m){
      case '{message}':
        return options.message;
      case '{text}':
        return options.text;
      case '{id}':
        return id;
      case "{icon}":
        return notificationsOptions.icons[options.theme];
      case '{theme}':
        return options.theme;
      case '{class}':
        return (typeof options.class == "string" ? options.class : (Array.isArray(options.class) ? options.class.join(" ") : ""));
      case '{details}':
        return (typeof options.details == "string" ? options.details : "Aucun détail");
      case '{question}':
        return (typeof options.question == "string" ? options.question : "Aucune question");
      case '{buttons}': {
        return options.buttons.map(button => {
          return notificationsOptions.modalButtonPattern.replace(/{(?:message|class|onclick)}/g, (m, _) => {
            switch(m){
              case '{message}':
                return button.message;
              case '{class}':
                return (typeof button.class == "string" ? button.class : (Array.isArray(button.class) ? button.class.join(" ") : ""));
              case '{onclick}':
                return `closeNotification('${id.replace(/"/g,  "\\'")}', '${button.name.replace(/"/g, "\\'")}')`;
            }
          });
        }).join("");
        break;
      }
      case '{svg}':
        return (typeof options.svg == "string" ? options.svg : notificationsOptions.svgModalDefault);
      default:
        return m;
    }
  })
}

function addNotification(options){
  if (options.constructor.name.toLowerCase() !== "object") throw new Error("Notification options must be an object");
  if (!(btoa instanceof Function)) throw new Error("btoa is not defined, the navigator does not support the base64 encoding");
  const id = generateUniqueId();
  if (!options.type) throw new Error("Notification type is not defined");
  switch(options["type"]){
    case "default": {
      if (!options.message) throw new Error("Notification message is not defined");
      if (!options.theme) throw new Error("Notification theme is not defined");
      notifications[id] = options
      const notif = generateNotificationString("default", options, id);
      document.getElementById("notifications-container").innerHTML += notif;
      break;
    }
    case "icon": {
      if (!options.message) throw new Error("Notification message is not defined");
      if (!options.theme) throw new Error("Notification theme is not defined");
      notifications[id] = options
      const notif = generateNotificationString("icon", options, id);
      document.getElementById("notifications-container").innerHTML += notif;
      break;
    }
    case "modal": {
      if (!options.question) throw new Error("Notification question is not defined");
      if (!options.details) throw new Error("Notification details is not defined");
      if (!options.buttons || !Array.isArray(options.buttons)) throw new Error("Notification buttons is not defined");
      if (!options.theme) throw new Error("Notification theme is not defined");
      notifications[id] = options
      const notif = generateNotificationString("modal", options, id);
      document.getElementById("notifications-container").innerHTML += notif;
      break;
    }
  }
}

function closeNotification(id, buttonName){
  const notif = document.getElementById(id);
  notif.remove();
  if (notifications[id].buttons.find((button) => button.name == buttonName ))
    notifications[id].buttons.find((button) => button.name == buttonName ).onclick();
  setTimeout(() => {
    delete notifications[id];
  }, 500)
}




/* TEST FUNCTIONS */
function testDefaultNotification(){
  addNotification({
    type: "default",
    message: "This is a default notification",
    theme: "info"
  });
}

function testIconNotification(){
  addNotification({
    type: "icon",
    message: "This is a icon notification",
    theme: "error"
  });
}

function testModal(){
  addNotification({
    type: "modal",
    question: "This is a modal notification",
    details: "This is a modal notification",
    buttons: [
      {
        name: "ok",
        message: "Yes",
        class: "confirm",
        onclick: () => console.error('Yes')
      },
      {
        name: "no",
        message: "No",
        class: "cancel",
        onclick: () => console.error('No')
      }
    ],
    theme: "warning"
  })
}