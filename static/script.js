// Import other js file functions
import { } from "./js/index.js"

// Proccess documents
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Ready!");

  switch (window.location.pathname) {
    case '/':
      console.log("Proccessing index.html");
      // TODO: Link index form handler

    default:
      console.error("On unkown page:", window.location.pathname);
  }
})
