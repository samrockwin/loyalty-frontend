import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("identifier", identifier);
    formData.append("password", password);

    const response = await api.post('/login.php', formData);

    localStorage.setItem('user', JSON.stringify(response.data.user));
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed. Ensure backend is running.');
  }
};
    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-logo">
                    <img src={logo} alt="NextGen Tyres Logo" />
                </div>
                <h2 className="text-center font-bold mb-4">Login</h2>
                {error && <p className="text-red text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email or Mobile</label>
                        <input
                            placeholder='example@gmail.com'
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            placeholder='***********'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full mb-4">
                        Login
                    </button>
                </form>
                
                <div className="text-center mt-4">
                    <p>Don't have an account? <a href="/register" className="text-red">Register</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
