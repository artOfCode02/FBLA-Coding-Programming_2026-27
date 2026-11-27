export function create_organization_listener() {
  console.log("Running create orgainzation button listener");

  const create_button = document.getElementById('create-organization');
  const create_dialog = document.getElementById('create-org-dialog');
  const close_button  = document.getElementById('close-dialog-button');
  const create_form   = document.getElementById('create-organization-form');
  const create_owner  = localStorage.getItem('username');

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
          body: JSON.stringify({create_title, create_desc, create_owner})
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

export async function select_organization_listener() {
  console.log("Running select orgnization dropdown listener");

  const org_dropdown = document.getElementById('organization-dropdown');


  // Prepopulate the dropdown with orginztions that the current user owns
  const username = localStorage.getItem('username');
  try {
    const response = await fetch('/get-orgs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username})
    });

    if (response.ok) {
      const data = await response.json();
      const orgs = data.owned_organizations;
      console.log("Owned organizations:", orgs);

      // Clear existing options
      org_dropdown.innerHTML = '';

      // Populate dropdown with owned organizations
      for (const [id, value] of Object.entries(orgs)) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = value.title;
        org_dropdown.appendChild(option);
      }
    } else {
      const error_body = await response.text();
      throw new Error(`Server returned status ${response.status}: ${error_body}`);
    }
  } catch (e) {
    console.error("Error fetching owned organizations:", e);
    alert("Failed to fetch owned organizations. Check DevTools console for details.");
  }

  // Add event listener for selection change
  org_dropdown.addEventListener('change', (event) => {
    const selected_org_id = event.target.value;
    console.log("Selected organization ID:", selected_org_id);
    // TODO: Implement logic to handle the selected organization, e.g., redirect or update the dashboard
  });
}
    
