async function login(username, password) {
    const credentials = btoa(`${username}:${password}`);

    //I will send the decoded credentials to the server
    //POST request to the API address to get the token
    try {
        const response = await fetch('https://01.gritlab.ax/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
    });
    
    const data = await response.json();
    console.log("Server response: ", data); // Log the response data

    if (response.ok) {
            console.log("token before saving:", data);
            sessionStorage.setItem("jwt", data)
            console.log("JWT saved:", sessionStorage.getItem("jwt")); // Log the saved JWT
            return [true, data];
        } else {
            console.error("Login failed: ", data.error);
            return [false, data.error || "An unknown error occurred"];
        }
    } catch (error) {
        console.error("Network error: ", error);
        return [false, "Login failed"];
}
}
function isLoggedIn() {
    const token = sessionStorage.getItem("jwt");
    console.log("Checking if user is logged in. Token:", token);
    return !!token;
  }

//logs out and removes the token
function logout() {
   sessionStorage.removeItem("jwt");
    window.location.reload();
}

//returns jwt token if it exists, otherwise null
function getJWT(){
    return sessionStorage.getItem("jwt");
}
