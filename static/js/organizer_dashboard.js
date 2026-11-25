export function create_organization_listener() {
  console.log("Running create orgainzation button listener");

  const create_button = document.getElementById('create-organization');
  const create_dialog = document.getElementById('create-org-dialog');
  const close_button  = document.getElementById('close-dialog-button');
  const create_form   = document.getElementById('create-organization-form');

  if (create_button && create_dialog) {
    console.log("Create orgainzation button exists, attaching listener");

    // Open create org diaog on click
    create_button.addEventListener('click', () => {
      console.log("Opening create orgainzation dialog")
      create_dialog.showModal();
    });

    // Close create org dialog when button click elsewhere
    create_dialog.addEventListener('click', (event) => {
      if (event.target === create_dialog) {
        console.log("Closing create orgainzation dialog")
        create_dialog.close();
      }
    });

    // Close create org dialog when close button click
    close_button.addEventListener('click', () => {
      console.log("Closing create orgainzation dialog");
      create_dialog.close();
    });

    // Create form listener
    create_form.addEventListener('submit', async (event) => {
      console.log("Create org form submitted")

      const create_title = document.getElementById('create-title').value;
      const create_desc  = document.getElementById('create-desc').value;

      try {
        const response = await fetch('/add-org', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({create_title, create_desc})
        });

        if (response.ok) {
          alert("Organization creation successful.");
          window.location.reload();
        } else {
          const error_body = await response.text();
          throw new Error(`Server returned status ${response.status}: ${error_body}`);
        }
      } catch (e) {
        console.error("Error creating organization:", e);
        alert("Failed creating organization. Check DevTools console for details.");
      }
    });
  }
}
