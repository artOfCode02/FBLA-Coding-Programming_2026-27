export function edit_organization_listener() {
  const edit_button = document.getElementById('edit-organization');
  const edit_dialog = document.getElementById('edit-org-dialog');
  const close_button = document.getElementById('close-edit-dialog-button');
  const edit_form = document.getElementById('edit-organization-form');

  if (!edit_button || !edit_dialog || !edit_form) {
    return;
  }

  edit_button.addEventListener('click', () => {
    document.getElementById('edit-title').value = document.getElementById('organization-name').textContent;
    document.getElementById('edit-desc').value = document.getElementById('organization-details-desc').value;
    document.getElementById('edit-contact').value = document.getElementById('organization-contact').value;
    document.getElementById('edit-location').value = document.getElementById('organization-location').value;
    edit_dialog.showModal();
  });

  close_button.addEventListener('click', () => {
    edit_dialog.close();
  });

  edit_dialog.addEventListener('click', (event) => {
    if (event.target === edit_dialog) {
      edit_dialog.close();
    }
  });

  edit_form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const edit_title = document.getElementById('edit-title').value.trim();
    const edit_desc = document.getElementById('edit-desc').value.trim();
    const edit_contact = document.getElementById('edit-contact').value.trim();
    const edit_location = document.getElementById('edit-location').value.trim();

    if (!edit_title || !edit_desc || !edit_contact || !edit_location) {
      alert('Please enter a title, description, email, and location.');
      return;
    }

    try {
      const response = await fetch('/edit-org', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          edit_title,
          edit_desc,
          edit_contact,
          edit_location
        })
      });

      if (!response.ok) {
        const error_body = await response.text();
        throw new Error(`Server returned status ${response.status}: ${error_body}`);
      }

      alert('Organization updated successfully.');
      edit_dialog.close();
      window.location.reload();
    } catch (error) {
      console.error('Error updating organization:', error);
      alert('Failed to update organization. Check DevTools console for details.');
    }
  });
}

export async function select_organization_listener() {
  console.log("Running single organization listener");

  const organization_name = document.getElementById('organization-name');
  const organization_contact = document.getElementById('organization-contact');
  const organization_location = document.getElementById('organization-location');
  const organization_desc = document.getElementById('organization-details-desc');
  const edit_button = document.getElementById('edit-organization');

  const username = localStorage.getItem('username');

  try {
    const response = await fetch('/get-orgs', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username})
    });

    if (response.ok) {
      const data = await response.json();
      const organizations = data.owned_organizations;
      const organization_entry = Object.entries(organizations)[0];

      if (organization_entry) {
        const [, organization] = organization_entry;
        organization_name.textContent = organization.title;
        organization_contact.value = organization.email || '';
        organization_location.value = organization.location || '';
        organization_desc.value = organization.desc || '';
        edit_button.hidden = false; // Show edit button when organization exists
      } else {
        organization_name.textContent = 'No organization created';
        organization_contact.value = '';
        organization_location.value = '';
        organization_desc.value = '';
        edit_button.hidden = true; // Hide edit button when no organization
      }
    } else {
      const error_body = await response.text();
      throw new Error(`Server returned status ${response.status}: ${error_body}`);
    }
  } catch (error) {
    console.error('Error fetching organization:', error);
    alert('Failed to fetch the organization. Check DevTools console for details.');
  }
}

export async function volunteer_management_listener() {
  const search_form = document.getElementById('volunteer-search-form');
  const search_input = document.getElementById('volunteer-search');
  const status_filter = document.getElementById('volunteer-status-filter');
  const volunteer_list = document.getElementById('volunteer-list');
  const empty_message = document.getElementById('volunteer-management-empty');
  const total_count = document.getElementById('volunteer-total-count');
  const active_count = document.getElementById('volunteer-active-count');
  const inactive_count = document.getElementById('volunteer-inactive-count');

  if (!search_form || !volunteer_list) return;

  let volunteers = {};

  async function loadVolunteers() {
    try {
      const response = await fetch('/get-volunteers');
      if (!response.ok) throw new Error(`Server returned status ${response.status}`);
      const data = await response.json();
      volunteers = data.volunteers || {};
      renderVolunteers();
    } catch (error) {
      console.error('Error loading volunteers:', error);
      alert('Failed to load volunteers. Check DevTools console for details.');
    }
  }

  function renderVolunteers() {
    const search = search_input.value.trim().toLowerCase();
    const status = status_filter.value;
    const entries = Object.entries(volunteers);

    total_count.textContent = entries.length;
    active_count.textContent = entries.filter(([, account]) => account.status === 'active').length;
    inactive_count.textContent = entries.filter(([, account]) => account.status === 'inactive').length;

    volunteer_list.innerHTML = '';
    const filtered = entries.filter(([username, account]) => {
      return username.toLowerCase().includes(search)
        && (status === 'all' || account.status === status);
    });

    empty_message.hidden = filtered.length !== 0;

    for (const [username, account] of filtered) {
      const row = document.createElement('tr');

      const username_cell = document.createElement('td');
      username_cell.textContent = username;

      const status_cell = document.createElement('td');
      status_cell.textContent = account.status;

      const actions_cell = document.createElement('td');
      const status_button = document.createElement('button');
      status_button.type = 'button';
      status_button.textContent = account.status === 'active' ? 'Deactivate' : 'Activate';
      status_button.dataset.username = username;
      status_button.dataset.status = account.status === 'active' ? 'inactive' : 'active';

      actions_cell.appendChild(status_button);
      row.append(username_cell, status_cell, actions_cell);
      volunteer_list.appendChild(row);
    }
  }

  search_form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderVolunteers();
  });

  search_input.addEventListener('input', renderVolunteers);
  status_filter.addEventListener('change', renderVolunteers);

  volunteer_list.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-username]');
    if (!button) return;

    try {
      const response = await fetch('/update-volunteer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: button.dataset.username,
          status: button.dataset.status
        })
      });

      if (!response.ok) throw new Error(`Server returned status ${response.status}`);
      await loadVolunteers();
    } catch (error) {
      console.error('Error updating volunteer:', error);
      alert('Failed to update volunteer status.');
    }
  });

  await loadVolunteers();
}

