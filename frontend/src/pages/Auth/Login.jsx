import React, { useState, useContext } from 'react';
import styles from './Login.module.css';
import loginImg from '../../assets/login.png';
import { Input, Button, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { AuthContext } from '../../context/Authcontext';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message: messageApi } = App.useApp();
  const { login } = useContext(AuthContext); // from context

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = {
        userName: username,
        passWord: password
      };

      const response = await AuthServices.loginUser(data);

      // Store in localStorage (optional, if you want persistence after refresh)
      localStorage.setItem("todoAppUser", JSON.stringify(response.data));

      // Update context so Navbar changes instantly
      login(response.data);

      messageApi.success("Logged in successfully");
      navigate('/to-do-list');
    } catch (err) {
      console.log(err);
      messageApi.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.login__card}>
        <img src={loginImg} alt=".." />
        <h2>Login</h2>

        <div className={styles.input__wrapper}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className={styles.input__wrapper}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className={styles.input__info}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <div className={styles.input__info}>
          New User? <Link to="/register">Register</Link>
        </div>

        <Button
          loading={loading}
          type="primary"
          size="large"
          disabled={!username || !password}
          onClick={handleSubmit}
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;
