//to check if the user is logged in or not
function initApp() {
  if (isLoggedIn()) {
    renderProfileView(getJWT());
  } else {
    renderLoginView();
  }
}
//when the DOM is loaded, the initApp function is called
document.addEventListener('DOMContentLoaded', initApp);


//function to query the user data 
async function fetchData(queryType) {
  
  //check if the user is logged in
  if (!isLoggedIn()) {
    console.warn("Not logged in - no token found");
    return [false, "Not logged in"];
  }

   // Define queries inside the fetchData function
   const queries = {
    userInfo: getUserInfoQuery,
    userXP: xpQuery,
    userSkills: skillsQuery
  };
  
  //check if the queryType is valid
  const query = queries[queryType];
  if (!query) {
    console.error("No query provided");
    return [false, "No query provided"];
  }

  const token = sessionStorage.getItem("jwt");
  
    try {
      const response = await fetch("https://01.gritlab.ax/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // sending the jwt to the server
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: query })
      });

      const data = await response.json();

      //checking if the response is ok
      if (response.ok) {
        console.log("Response data:", data);
        return [true, data.data];
      } else {
        console.error("Error response:", data.errors || "No data field"); 
        return [false, data.errors || "No data field"];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [false, "Error fetching data"];
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
