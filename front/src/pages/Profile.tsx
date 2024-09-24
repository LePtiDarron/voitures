import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import Footer from './../components/Footer';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

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
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du profil :', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleEditProfile = () => {
    window.location.href = '/profile/edit';
  };

  const handleEditProfilePicture = () => {
    window.location.href = '/profile/editpicture';
  };

  const handleShowOrders = () => {
    window.location.href = '/profile/orders';
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte :', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className='container'>
        {userData ? (
          <div className='profile'>
            <div className='main'>
              <img
                className="profile-picture"
                src={`${process.env.REACT_APP_BACK_URL}/uploads/profile_pictures/${userData.profilePicture}`}
              />
              <h2>{userData.username}</h2>
              <p>{userData.email}</p>
            </div>
            <div className='secondary'>
              <p>Nom complet : {userData.firstName} {userData.lastName}</p>
              <p>Téléphone : {userData.phone}</p>
              <p>Genre : {userData.gender}</p>
              <p>Adresse : {userData.address}</p>
              <p>Ville : {userData.city}</p>
            </div>
            <div className='goodButtons'>
              <button onClick={handleShowOrders}>Mes commandes</button>
              <button onClick={handleEditProfile}>Modifier mon profil</button>
              <button onClick={handleEditProfilePicture}>Modifier ma photo de profil</button>
            </div>
            <div className='badButtons'>
              <button onClick={handleLogout}>Déconnexion</button>
              <button onClick={handleDeleteAccount}>Supprimer mon compte</button>
            </div>
          </div>
        ) : (
          <p>Chargement du profil...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
