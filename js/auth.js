async function login(username, password) {
    //decoding the username and password to base64
    const credentials = btoa(`${username}:${password}`);

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
            sessionStorage.setItem("jwt", data) //saving just the token from the data 
            return [true, data];
        } else {
            console.error("Login failed: ", data.error); //the messages we see when something goes wrong in the login
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
    const token = sessionStorage.getItem("jwt");
    if (!token) {
        console.error("No JWT token found in sessionStorage");
    return null;
        }
    return token;
}
