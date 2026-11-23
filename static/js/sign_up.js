export function sign_up_form_listener() {
  console.log("Running sign_up_form_listener");

  const sign_up_form = document.getElementById("sign-up-form");

  if (sign_up_form) {
    console.log("Sign up form exists, attaching listener");

    sign_up_form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log("sign_up_form submitted");

      const role          = document.querySelector('input[name="role"]:checked')?.value;
      const username      = document.getElementById('username').value;
      const password      = document.getElementById('password').value;
      const password_conf = document.getElementById('confirm-password').value;

      console.log("Password:", password);
      console.log("Conf", password_conf);

      // Check if confirm password matches
      if (password !== password_conf) {
        alert("Passwords do not match. Try again");
        //window.location.reload();
        return;
      }

      // Add username/password to database
      try {
        const response = await fetch('/add-credentials', {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password, role})
        });

        if (response.ok) {
          // Redirect to sign in page if successfull
          alert("Sign up complete. Redirecting to sign in page...");
          window.location.href = "/";
        } else {
          const error_body = await response.text();
          throw new Error(`Server returned status ${response.status}: ${error_body}`);
        }
      } catch (e) {
        console.error("Error adding credentials:", e);
        alert("Failed adding credentials. Check DevTools console for details.");
      }
    });
  }
}
