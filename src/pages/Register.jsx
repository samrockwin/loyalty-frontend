import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register.php', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Ensure backend is running.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-logo">
                    <img src={logo} alt="NextGen Tyres Logo" />
                </div>
                <h2 className="text-center font-bold mb-4">Register</h2>
                {error && <p className="text-red text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        Register
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p>Already have an account? <a href="/login" className="text-red">Login</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
