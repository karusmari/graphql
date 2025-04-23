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
  document.getElementById('profile-section').style.display = 'flex';
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
  
  if (!userInfoSuccess || !userInfoData?.user || userInfoData.user.length === 0) {
    console.error("Error loading profile:", userInfoData?.user);
    return;
  }
  const user = userInfoData.user?.[0];
  if (!user) {
    console.error("User data missing from userInfoData:", userInfoData);
    return;
  }
  console.log("User XP data:", user.xps);
  const attrs = user.attrs || {};
  const email = user.attrs?.email || "No email provided"; //vaata see yle
  const xpTransactions = xpData.transaction || [];
  const filteredXps = xpTransactions.filter(xp =>
    xp.path &&
    xp.path.includes("school-curriculum") &&
    !xp.path.includes("piscine") &&
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
        console.log("Including XP:", xp); // Logige iga XP, mis liidetakse
        return sum + xp.amount;
      }, 0)
  : 0;
console.log("Filtered XP:", user.xps);
console.log("XP amount:", xpAmount);

  
  const skills = skillsData?.user[0]?.skills || [];
  
  renderXPchart(filteredXps);
  
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
