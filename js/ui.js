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
  
  //removes the login form
  const loginSection = document.getElementById('login-section');
  if (loginSection) {
    loginSection.remove(); // Remove the login form if it exists
  }
  
  document.getElementById('user-header').style.display = 'flex';
  
  //shows the profile section
  const profileSection = document.getElementById('profile-section');
  if (profileSection) {
    profileSection.style.display = 'block'; 
  }
  
  const [userInfoSuccess, userInfoData] = await fetchUserData('userInfo');
  
  if (userInfoSuccess && userInfoData?.user) {
    const user = userInfoData.user[0];
    const attrs = user.attrs || {};
    const email = user.attrs?.email || "No email provided";
    
  document.getElementById('header-email').textContent = email;
  document.getElementById('id').textContent = `User ID: ${user.id}`;
  document.getElementById('profile-email').textContent = `Email: ${attrs.email || "No email provided"}`;
  document.getElementById('profile-firstName').textContent = `First Name: ${user.firstName || 'N/A'}`;
  document.getElementById('profile-lastName').textContent = `Last Name: ${user.lastName || 'N/A'}`;
  document.getElementById('profile-tshirtSize').textContent = `T-shirt Size: ${attrs.tshirtSize || 'N/A'}`;
  document.getElementById('nationality').textContent = `Nationality: ${attrs.nationality || 'N/A'}`;
  document.getElementById('campus').textContent = `Campus: ${user.campus || 'N/A'}`;
} else {
  console.error("Error loading profile:", userInfoData?.user);
  return;
}
}

//handle logout button
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    logout();  
    renderLoginView(); // Render the login view again
    document.getElementById('user-header').style.display = 'none'; // Hide the user header
  });
} else {
  console.error("Logout button not found");
}
