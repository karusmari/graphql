function initApp() {
  if (isLoggedIn()) {
    renderProfileView(getJWT());
  } else {
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
  
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched user data:", data); // Log the fetched data
        return [true, data.data];
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData); // Log the error response
        return [false, errorData];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [false, "Error fetching data"];
    }
  }

  async function fetchUserData(queryType) {
    switch (queryType) {
      case 'userInfo':
        console.log("using getUserInfoQuery:", getUserInfoQuery);
        return fetchData(getUserInfoQuery);
      case 'userXP':
        console.log("using xpQuery:", xpQuery);
        return fetchData(xpQuery);
      default:
        return [false, "Unknown query type"];
    }
  }
