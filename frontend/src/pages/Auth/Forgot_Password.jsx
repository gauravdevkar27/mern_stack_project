import React, { useState } from 'react';
import styles from './Login.module.css';
import loginImg from '../../assets/login.png';
import { Input, Button, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { getErrorMessage } from '../../utils/GetError';

function Forgot_Password() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { message: messageApi } = App.useApp();

    const handleRequestReset = async () => {
        try {
            setLoading(true);
            await AuthServices.requestPasswordReset({ username });
            setSubmitted(true);
            
        } catch (err) {
            console.log(err);
            messageApi.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.login__card}>
                <img src={loginImg} alt=".." />
                <h2>Forgot Password</h2>

                {submitted ? (
                    <div className={styles.input__info} style={{ textAlign: 'center', maxWidth: '80%' }}>
                        Please check your email for a link to reset your password. If you don't see it, check your spam folder.
                    </div>
                ) : (
                    <>
                        <div className={styles.input__wrapper}>
                            <Input
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <Button
                            loading={loading}
                            type="primary"
                            size="large"
                            disabled={!username || loading}
                            onClick={handleRequestReset}
                        >
                            Send Reset Link
                        </Button>
                    </>
                )}

                <div className={styles.input__info}>
                    Remember your password? <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Forgot_Password;
