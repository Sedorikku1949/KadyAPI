console.log("blep")

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