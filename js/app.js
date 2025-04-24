//to check if the user is logged in or not
function initApp() {
  if (isLoggedIn()) {
    renderProfileView(getJWT());
  } else {
    renderLoginView();
  }
}
window.addEventListener('load', initApp);

//function to query the user data 
async function fetchData(query) {
    const token = sessionStorage.getItem("jwt");

    //check if the user is logged in
    if (!token) {
      console.warn("Not logged in - no token found");
      return [false, "Not logged in"];
    }

    //check if the query is valid
    if (!query) {
      console.error("No query provided");
      return [false, "No query provided"];
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

      const data = await response.json();

      //checking if the response is ok
      if (response.ok) {
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


//function to query the data based on the query type
async function fetchUserData(queryType) {
    const queries = {
      userInfo: getUserInfoQuery,
      userXP: xpQuery,
      userSkills: skillsQuery
  };

  //checking if the queryType is valid
  const query = queries[queryType];
  if (!query) {
      console.error(`Unknown query type: ${queryType}`);
      return [false, "Unknown query type"];
  }

  //doing the query through the fetchData function
  return await fetchData(query);
}
