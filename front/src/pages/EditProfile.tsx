import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';
import Footer from './../components/Footer';

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const userData = response.data;
          setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone || '',
            address: userData.address || '',
            city: userData.city || '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du profil :', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.put(`${process.env.REACT_APP_BACK_URL}/api/users`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil :', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <h1>Modifier Profil</h1>
            <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} />
            <input type="text" name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} />
            <input type="text" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} />
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
