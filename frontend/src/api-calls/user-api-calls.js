
var user = null

export async function getCurrentUser(callback) {
    if (user) { 
        callback(user, true);
    }

    try {
      const response = await fetch("/api/user/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    if (response.status != 200) { 
        callback(null, false);
        return;
    }
    user = await response.json();  
    callback(user);
    } catch (err) {
        console.log(err);
        callback(null, false)
    }
}




export async function getUserPostHistory(userId, callback) {
    try{
        const response = await fetch('/api/user/' + userId + "/postHistory", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        callback(data);
        return 
    }catch(err){
        console.log(err)
    }
}


export async function getUserCollection(userId, callback) {
    console.log("enter get user collection")
    try{
        const response = await fetch('/api/user/' + userId + "/collections", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'}
        })
        const data = await response.json()
        callback(data);
        return 
    }catch(err){
        console.log(err)
    }
}

export async function addCollection(question_id) {
    fetch('/api/user/' + question_id + '/collect', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
}

export async function removeCollection(question_id) {
    fetch('/api/user/' + question_id + '/uncollect', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
    })
}

export const loginUser = async (username, password) => {

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        if (data.errors) {
            return {errors: {usernameError: data.errors.username, passwordError: data.errors.password}}
        }
        if (data.user) {
            // check user type 
            user = data.user
            return data
        }
    } catch (err) {
        console.log(err)
    }
    
}

export const signUpUser = async (username, password) => {
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        })
        const data = await response.json()
        user = data.user;
        return data
    } catch (err) {
        console.log(err)
    }
    
}

export const logOutUser = () => {
    try {
        fetch('/api/logout',
            {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
            })
            .then(() => { 
            user = null;
        })
        
    } catch (err) {
        console.log(err)
    }
    
}

