import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Signup.css';
import Footer from './../components/Footer';


const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    address: '',
    city: '',
    gender: 'Homme',
    phone: '',
    profilePicture: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        profilePicture: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('firstname', formData.firstname);
    formDataToSend.append('lastname', formData.lastname);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('phone', formData.phone);
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/api/signup`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="signup-page">
        <div className="signup-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <input type="text" name="username" placeholder="Pseudo" value={formData.username} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
            <input type="text" name="firstname" placeholder="Prénom" value={formData.firstname} onChange={handleChange} required />
            <input type="text" name="lastname" placeholder="Nom" value={formData.lastname} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} required />
            <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} required />
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
            <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
            <input type="file" name="profilePicture" onChange={handleFileChange} accept="image/*" />
            <button type="submit">Créer un compte</button>
            <div className="login-link">
              <p>Vous avez déjà un compte? <Link to="/login">Se connecter.</Link></p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;