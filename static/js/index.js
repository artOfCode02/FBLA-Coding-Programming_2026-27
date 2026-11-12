// Sign in box form listener
export function index_form_listener() {
  console.log("Running index_form_listner");

  const init_form = document.getElementById('sign-in-box');

  if (init_form) {
    console.log("init_form exists, attaching listener");

    // Run when form is submitted in index.html
    init_form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log("init_form submitted");

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const role     = document.querySelector('input[name="role"]:checked')?.value;

      let verify_status = false;

      // Submit username and password to verify
      try {
        const response = await fetch('/verify-credentials', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password})
        })

        if (response.ok) {
          const data = await response.json()
          verify_status = data.verified || false
          console.log("Server credential verification status:", verify_status);
        } else {
          const error_body = await response.text();
          throw new Error(`Server returned status ${response.status}: ${error_body}`);
        }

      } catch (e) {
        console.error("Error verifying credentials:", e);
        alert("Failed verifying credentials. Check DevTools console for details.");
      }

      if (verify_status) {
        // Redirect based on role selected
        if (role === "volunteer") {
          window.location.href = "/volunteer-dashboard";
        } else if (role === "organizer") {
          window.location.href = "/organizer-dashboard";
        }
      } else {
        // TODO: Tempoary form, needs work
        alert("Incorrect username or password.");
       // window.location.reload();
      }
    });
  }
}
