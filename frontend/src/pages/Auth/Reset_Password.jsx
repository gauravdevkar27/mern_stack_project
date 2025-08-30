import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Input, Button, App, Spin, Result, Form } from 'antd';
import AuthServices from '../../services/authServices';
import styles from './Login.module.css';
import { getErrorMessage } from '../../utils/GetError';

function Reset_Password() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { message: messageApi } = App.useApp();

    const [verificationState, setVerificationState] = useState('verifying'); // 'verifying', 'valid', 'invalid'
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerificationState('invalid');
                return;
            }
            try {
                // This service call corresponds to GET /reset-password/:token
                await AuthServices.verifyResetToken(token);
                setVerificationState('valid');
            } catch (error) {
                console.error("Token verification failed:", error);
                messageApi.error(getErrorMessage(error) || "Invalid or expired reset link.");
                setVerificationState('invalid');
            }
        };
        verifyToken();
    }, [token, messageApi]);

    const handleResetPassword = async (values) => {
        const { newPassword } = values;
        try {
            setLoading(true);
            // This service call corresponds to POST /reset-password
            await AuthServices.resetPassword({ token, newPassword });
            messageApi.success("Password has been reset successfully! You can now log in.");
            navigate('/login');
        } catch (err) {
            console.error("Password reset failed:", err);
            messageApi.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (verificationState === 'verifying') {
        return <Spin tip="Verifying reset link..." size="large" fullscreen />;
    }

    if (verificationState === 'invalid') {
        return (
            <Result
                status="error"
                title="Invalid or Expired Link"
                subTitle="The password reset link is invalid or has expired. Please request a new one."
                extra={[
                    <Button type="primary" key="request" onClick={() => navigate('/forgot-password')}>
                        Request New Link
                    </Button>,
                    <Button key="login" onClick={() => navigate('/login')}>Back to Login</Button>,
                ]}
            />
        );
    }

    return (
        <div>
            <div className={styles.login__card}>
                <h2>Reset Password</h2>
                <Form form={form} onFinish={handleResetPassword} style={{ width: '80%' }}>
                    <Form.Item
                        name="newPassword"
                        rules={[{ required: true, message: 'Please enter your new password!' }]}
                    >
                        <Input.Password placeholder="Enter new password" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm new password" />
                    </Form.Item>

                    <Button loading={loading} type="primary" size="large" htmlType="submit" block>
                        Reset Password
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Reset_Password;