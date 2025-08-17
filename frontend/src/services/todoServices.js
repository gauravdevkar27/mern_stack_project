import axios from 'axios';
import { getUserDetails } from '../utils/GetUser';
const SERVER_URL = 'http://localhost:5000/api/todo';

let authheader = () =>{
    let userToken = getUserDetails()?.token;
    return {headers:{'Authorization':userToken}}

}
const createToDo = (data) => {
    return axios.post(SERVER_URL+'/create-to-do', data, authheader());
}
const getAllToDo = (userId)=>{
    return axios.get(SERVER_URL+'/get-all-to-do/'+userId,authHeaders());
}

const deleteToDo = (id)=>{
    return axios.delete(SERVER_URL+'/delete-to-do/'+id,authHeaders());
}

const updateToDo = (id,data)=>{
    return axios.patch(SERVER_URL+'/update-to-do/'+id,data,authHeaders());
}



const ToDoServices = {
    createToDo,
    getAllToDo,
    deleteToDo,
    updateToDo
}


export default ToDoServices;