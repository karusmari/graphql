function initApp() {
  console.log("Initializing app...");
  if (isLoggedIn()) {
    console.log("User is logged in");
    renderProfileView(getJWT());
  } else {
    console.log("User is not logged in");
    renderLoginView();
  }
}

window.addEventListener('load', initApp);


async function fetchData(query) {
  console.log("Fetching user data...", query);
    const token = sessionStorage.getItem("jwt");

    if (!query) {
      console.error("No query provided");
      return [false, "No query provided"];
    }
  
    //check if the user is logged in
    if (!token) {
      console.warn("Not logged in - no token found");
      return [false, "Not logged in"];
    }
  
    try {
      const response = await fetch("https://01.gritlab.ax/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // sending the jwt to the server
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: query })
      });

      console.log("Response status:", response.status); // Log the response status
      const data = await response.json();

      if (response.ok) {
        console.log("Fetched user data:", data.data); // Log the fetched data
        return [true, data.data];
      } else {
        console.error("Error response:", data.errors || "No data field"); // Log the error response
        return [false, data.errors || "No data field"];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [false, "Error fetching data"];
    }
  }

  async function fetchUserData(queryType) {
    console.log("Fetching user data for query type:", queryType);
    switch (queryType) {
      
      case 'userInfo':
        console.log("using getUserInfoQuery:", getUserInfoQuery);
        return await fetchData(getUserInfoQuery);

      case 'userXP':
        console.log("using xpQuery:", xpQuery);
        return await fetchData(xpQuery);

      case 'userSkills':
        console.log("using skills:", skillsQuery);
        return await fetchData(skillsQuery);


      default:
        return [false, "Unknown query type"];
    }
  }
