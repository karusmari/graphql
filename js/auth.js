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

    if (response.ok) {
            sessionStorage.setItem("jwt", data)
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
