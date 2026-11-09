// Sign in box form listener
export function index_form_listner() {
  console.log("Running index_form_listner");

  const init_form = document.getElementById('sign-in-box');

  if (init_form) {
    console.log("init_form exists, attaching listener");

    // Run when form is submitted in index.html
    init_form.addEventListener('submit', async (event) => {
      event.preventDefault();
      console.log("init_form submitted");

      const username = document.getElementById('username');
      const password = document.getElementById('password');

      // TODO: link database of username/password to here to verify
    });
  }
}
