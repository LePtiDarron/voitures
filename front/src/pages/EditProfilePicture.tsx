import React, { useState } from 'react';
import axios from 'axios';
import './EditProfilePicture.css';
import Footer from './../components/Footer';

const EditProfilePicture: React.FC = () => {
  const [formData, setFormData] = useState({
    profilePicture: null as File | null,
  });

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
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }
  
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/users/picture`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        });
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Error updating user photo:', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="edit-picture-page">
        <div className="edit-picture-container">
          <form className='edit-picture-form' onSubmit={handleSubmit}>
            <input type="file" name="profilePicture" onChange={handleFileChange} accept="image/*" />
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfilePicture;
