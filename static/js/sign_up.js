export function sign_up_form_listener() {
  console.log("Running sign_up_form_listener");

  const sign_up_form = document.getElementbyId("sign-up-form");

  if (sign_up_form) {
    console.log("Sign up form exists, attaching listener");

    sign_up_form.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log("sign_up_form submitted");

      const role          = document.querySelector('input[name="role"]:checked')?.value;
      const username      = document.getElementbyId('username');
      const password      = document.getElementbyId('password');
      const password_conf = document.getElementbyId('confirm-password');

      // Check if confirm password matches
      if (password !== password_conf) {
        alert("Passwords do not match. Try again");
        window.location.reload();
      }

      // Add username/password to database
      
    });
  }
}
