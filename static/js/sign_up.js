export function sign_up_form_listener() {
  console.log("Running sign_up_form_listener");

  const sign_up_form = document.getElementbyId("sign-up-form");

  if (sign_up_form) {
    console.log("Sign up form exists, attaching listener");

    sign_up_form.addEventListener('submit', (event) => {

    });
  }
}
