import React, { useState } from 'react'
import styles from './Login.module.css';
import { Button, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import login from '../../assets/login.png'
import { getErrorMessage } from '../../utils/GetError';
import AuthServices from '../../services/authServices';
import { App } from 'antd';
function Register() {

  const [userName, setUsername] = useState("");
  const [passWord, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        firstName,
        lastname,
        userName,
        passWord
      }
      const response = await AuthServices.registerUser(data);
      console.log(response.data);
      setLoading(false);
      messageApi.success("You`re Registered successfully");
      navigate('/login');
    } catch (err) {
      console.log(err);
      messageApi.error(getErrorMessage(err));

    }
  }

  return (
    <div>
      <div className={styles.login__card}>
        <img src={login} alt='..' />
        <h2>Register</h2>
        <div className={styles.input__inline__wrapper}>
          <Input
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
          <Input
            placeholder='Last Name'
            value={lastname}
            onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className={styles.input__wrapper}>
          <Input
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.input__wrapper}>
          <Input.Password
            placeholder="Password"
            value={passWord}
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles.input__info}>
          Existing User? <Link to="/login">Login</Link>
        </div>
        <Button loading={loading} type="primary" size="large" disabled={!userName || !passWord} onClick={handleSubmit} >Login</Button>
      </div>


    </div>
  )
}

export default Register
