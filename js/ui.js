function renderLoginView() {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (event) => { 
      event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const [success, message] = await login(username, password);
  if (success) {
      renderProfileView();
  } else {
      document.getElementById("error-message").textContent = message; 
  }
});
}

async function renderProfileView() {
  if (!isLoggedIn()) {
      renderLoginView(); 
      return;
    }

  const loginSection = document.getElementById('login-section');
  if (loginSection) {
      loginSection.remove(); // Remove the login form if it exists
    }


  const [success, data] = await fetchData(getUserInfoQuery);
  console.log("User data fetched:", { success, data });

  if (success && data?.user) {
    const login = data.user.login;

    document.getElementById('app').innerHTML = `
    <h2>Welcome to your profile</h2>
    <p>Username: ${login}</p> <!-- Siin näitad kasutaja infot, mis saad API-st -->
    <button id="logout-button">Log out</button>
  `;
} else {
    console.error("Error loading profileee:", data.user);
    return;
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();  
    renderLoginView(); // Render the login view again
  });
} else {
  console.error("Logout button not found");
}
}

