// Import other js file functions
import { index_form_listener }   from "./js/index.js"
import { sign_up_form_listener } from "./js/sign_up.js"
import { create_organization_listener, select_organization_listener } from "./js/organizer_dashboard.js"

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
    case '/organizer-dashboard':
      console.log("Proccessing orgaizer_dashboard.html");
      create_organization_listener();
      select_organization_listener();
      break;

    default:
      console.error("On unkown page:", window.location.pathname);
      break;
  }
})
