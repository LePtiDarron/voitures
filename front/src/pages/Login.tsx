import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';
import Footer from './../components/Footer';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/login`, {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Se connecter</h2>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Se connecter</button>
          <div className="signup-link">
            <p>Vous n'avez pas de compte?</p>
            <Link to="/signup">Créer un compte</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
