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

  window.scrollTo(0, 0); 

  document.getElementById('login-section')?.remove();
  document.getElementById('user-header').style.display = 'flex';
  document.getElementById('profile-section').style.display = 'flex';
  document.getElementById('skills-chart').style.display = 'block';
  
  
  const [userInfoSuccess, userInfoData] = await fetchUserData('userInfo');
  const [xpSuccess, xpData] = await fetchUserData('userXP');
  const [skillsSuccess, skillsData] = await fetchUserData('userSkills');
  
  //checking if the data has been received and is valid
  if (!userInfoSuccess || !userInfoData?.user || userInfoData.user.length === 0) {
    console.error("Error loading profile:", userInfoData?.user);
    return;
  }

  if (!xpSuccess || !xpData?.transaction) {
    console.error("Error loading XP data:", xpData);
    return;
  }

  if (!skillsSuccess || !skillsData?.user) {
    console.error("Error loading skills data:", skillsData);
    return;
  }

  const user = userInfoData.user?.[0];
  const attrs = user.attrs || {};
  const email = user.attrs?.email || "No email provided"; 
  const xpTransactions = xpData.transaction || [];
  const filteredXps = xpTransactions.filter(xp =>
    xp.path &&
    !xp.path.includes("piscine-go") &&
    (
      !xp.path.includes("piscine-js") || 
       xp.path.endsWith("piscine-js")
    ) &&
    xp.createdAt &&
    !isNaN(new Date(xp.createdAt)) &&
    xp.amount > 0
  );
  
  const xpAmount = user.xps && user.xps.length > 0
  ? user.xps
    .filter(xp =>
        xp.path &&
        !xp.path.includes("piscine-go") &&
      (
        !xp.path.includes("piscine-js") || 
         xp.path.endsWith("piscine-js")
      )
    )
      .reduce((sum, xp) => {
        return sum + xp.amount;
      }, 0)
  : 0;

  
  const skills = skillsData?.user[0]?.skills || [];
  
  renderXPchart(filteredXps);
  
  if (skills.length > 0) {
    renderSkillChart(skills);
  } else {
    document.getElementById('skills-chart').textContent = 'N/A';
  }
  document.getElementById('graph-section').style.display = 'block';
  document.getElementById('header-email').textContent = email; 
  document.getElementById('id').textContent = `${user.id || 'N/A'}`;
  document.getElementById('profile-email').textContent = `${attrs.email || "No email provided"}`;
  document.getElementById('profile-firstName').textContent = `${user.firstName || 'N/A'}`;
  document.getElementById('profile-lastName').textContent = `${user.lastName || 'N/A'}`;
  document.getElementById('nationality').textContent = `${attrs.nationality || 'N/A'}`;
  document.getElementById('user-xp').textContent = `${xpAmount || 'N/A'}`;

  const auditRatio = userInfoData?.user[0]?.auditRatio || 'N/A'; 
  const formattedAuditRatio = (auditRatio !== 'N/A') ? parseFloat(auditRatio).toFixed(1) : 'N/A';
  document.getElementById('audit-ratio').textContent = `${formattedAuditRatio}`;
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
