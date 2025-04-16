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
  

  document.getElementById('login-section')?.remove();
  document.getElementById('user-header').style.display = 'flex';
  document.getElementById('profile-section').style.display = 'block';
  document.getElementById('skills-chart').style.display = 'block';
  
  
  const [userInfoSuccess, userInfoData] = await fetchUserData('userInfo');
  const [XPsuccess, xpData] = await fetchUserData('userXP');
  if (XPsuccess) {
    console.log("Fetched XP data:", xpData);
  }

  const [success, skillsData] = await fetchUserData('userSkills');
  if (success) {
    console.log("Fetched skills data:", skillsData);
  }
  

  if (!userInfoSuccess && !userInfoData?.user) {
    console.error("Error loading profile:", userInfoData?.user);
    return;
  }

  const user = userInfoData.user[0];
  const attrs = user.attrs || {};
  const email = user.attrs?.email || "No email provided"; //vaata see yle
  const transactions = xpData.transaction || [];
  const xpAmount = xpData.transaction_aggregate.aggregate.sum.amount || 0;
  const skills = skillsData?.user[0]?.skills || [];
  
  renderXPchart(user.xps);
  
  if (skills.length > 0) {
    renderSkillChart(skills);
  } else {
    document.getElementById('skills-chart').textContent = 'N/A';
  }
  document.getElementById('graph-section').style.display = 'block';

  document.getElementById('header-email').textContent = email; //vaata see yle 
  document.getElementById('id').textContent = `${user.id || 'N/A'}`;
  document.getElementById('profile-email').textContent = `${attrs.email || "No email provided"}`;
  document.getElementById('profile-firstName').textContent = `${user.firstName || 'N/A'}`;
  document.getElementById('profile-lastName').textContent = `${user.lastName || 'N/A'}`;
  document.getElementById('profile-tshirtSize').textContent = `${attrs.tshirtSize || 'N/A'}`;
  document.getElementById('nationality').textContent = `${attrs.nationality || 'N/A'}`;
  document.getElementById('campus').textContent = `${user.campus || 'N/A'}`;
  document.getElementById('user-xp').textContent = `${xpAmount || 'N/A'}`;

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
