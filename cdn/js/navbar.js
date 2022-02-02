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