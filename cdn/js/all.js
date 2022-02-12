
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

const lastNotification = null;

function parseNotifTheme(obj){
  switch(obj.theme){
    case "success":
      return ({ color: "#42be65", title: obj.title || "Succès", message: obj.message, duration: obj.duration || -1, });
    case "error":
      return ({ color: "#fa4d56", title: obj.title || "Erreur", message: obj.message, duration: obj.duration || -1, });
    case "warning":
      return ({ color: "#f1c21b", title: obj.title || "Attention", message: obj.message, duration: obj.duration || -1, });
    case "info":
      return ({ color: "#4589ff", title: obj.title || "Information", message: obj.message, duration: obj.duration || -1, });
    default:
      return ({ color: "#4589ff", title: obj.title || "Information", message: obj.message, duration: obj.duration || -1, });
  }
}

function createNotification(obj){
  if (getValueType(obj) !== "object") throw new Error("Invalid object was provided");
  if ((!obj.title && !obj.type) || !obj.message || !obj.type) throw new Error("Invalid object was provided");
  if (!document.getElementById("notification-container")) document.getElementsByTagName("body")[0].innerHTML += "<div id='notification-container'></div>";
  const container = document.getElementById("notification-container");
  const notifOptions = parseNotifTheme(obj);
  lastNotification = notifOptions;
}

function closeNotification(id){}