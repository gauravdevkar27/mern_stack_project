import React, { useState, useEffect } from 'react';
import styles from './Login.module.css';
import loginImg from '../../assets/login.png';
import { Input, Button, App } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { getErrorMessage } from '../../utils/GetError';

function Forgot_Password() {
    const [userName, setUserName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const { message: messageApi } = App.useApp();

    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            await AuthServices.verifyResetToken(token);
            setIsResetMode(true);
            setTokenValid(true);
        } catch (err) {
            messageApi.error("Invalid or expired reset link");
            setTokenValid(false);
        }
    };

    const handleRequestReset = async () => {
        if (!userName) {
            messageApi.error("Please provide a username.");
            return;
        }
        try {
            setLoading(true);
            const response = await AuthServices.requestPasswordReset({ userName });
            setSubmitted(true);
            messageApi.success("Username verified. Please set your new password.");
        } catch (err) {
            console.log(err);
            messageApi.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            messageApi.error("Passwords don't match!");
            return;
        }
        if (newPassword.length < 6) {
            messageApi.error("Password must be at least 6 characters long");
            return;
        }
        try {
            setLoading(true);
            // Get the token from the URL or console output
            const resetToken = window.location.pathname.split('/').pop(); // Get token from URL
            await AuthServices.resetPassword({ 
                token: resetToken,
                newPassword: newPassword,
                userName: userName
            });
            messageApi.success("Password has been reset successfully!");
            navigate('/login');
        } catch (err) {
            messageApi.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.login__card}>
                <img src={loginImg} alt=".." />
                <h2>{isResetMode ? 'Reset Password' : 'Forgot Password'}</h2>

                {submitted ? (
                    <>
                        <div className={styles.input__wrapper}>
                            <Input
                                placeholder="Enter your username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.input__wrapper}>
                            <Input.Password
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className={styles.input__wrapper}>
                            <Input.Password
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button
                            loading={loading}
                            type="primary"
                            size="large"
                            disabled={!newPassword || !confirmPassword || loading}
                            onClick={handleResetPassword}
                        >
                            Reset Password
                        </Button>
                    </>
                ) : (
                    <>
                        <div className={styles.input__wrapper}>
                            <Input
                                placeholder="Enter your username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button
                            loading={loading}
                            type="primary"
                            size="large"
                            disabled={!userName || loading}
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
