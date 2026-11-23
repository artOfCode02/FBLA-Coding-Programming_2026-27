// Import other js file functions
import { index_form_listener }   from "./js/index.js"
import { sign_up_form_listener } from "./js/sign_up.js"

// Proccess documents
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Ready!");

  switch (window.location.pathname) {
    case '/':
      console.log("Proccessing index.html");
      index_form_listener();
      break;

    case '/sign-up':
      console.log("Proccessing sign_up.html")
      sign_up_form_listener();
      break;
    
    // TODO: Add js for organzier and volunteer dashboards

    default:
      console.error("On unkown page:", window.location.pathname);
      break;
  }
})
