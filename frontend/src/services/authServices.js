import axios from 'axios';

//const SERVER_URL = 'https://mern-stack-project-xy13.onrender.com/api';

const SERVER_URL = 'http://localhost:5000/api'

const registerUser = (data) => {
    return axios.post(SERVER_URL+'/register', data);
}

const loginUser = (data) => {
    return axios.post(SERVER_URL+'/login', data);
}

const requestPasswordReset = (data) => {
    return axios.post(SERVER_URL+'/forgot-password', data);
}

// This function will be called to verify the token from the URL
// when the user clicks the reset link in their email.
const verifyResetToken = (token) => {
    return axios.get(SERVER_URL + '/reset-password/' + token);
};

// This function will be called when the user submits the new password.
// The data object should contain the token and the new password.
const resetPassword = (data) => {
    return axios.post(SERVER_URL+'/reset-password', data);
}

const AuthServices = {
    registerUser,
    loginUser,
    requestPasswordReset,
    verifyResetToken,
    resetPassword
}

export default AuthServices;
