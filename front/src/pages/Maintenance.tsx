import React, { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from './../components/Footer';
import './Maintenance.css';

interface Maintenance {
  description: string;
}

const MaintenancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [maintenance, setMaintenance] = useState<Maintenance>({ description: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaintenance({ ...maintenance, description: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('description', maintenance.description);
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/maintenance/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.href = `/mod/cars/${id}`;
      }
    } catch (error) {
      console.error('Erreur lors de la création de la maintenance :', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="maintenance-page">
        <div className="maintenance-container">
        <h3>Mettre à jour l'entretien</h3>
        <form className='maintenance-form' onSubmit={handleSubmit}>
          <input placeholder='Nouvel Entretien' type="text" value={maintenance.description} onChange={handleInputChange} className="quantity-input" required/>
          <button className='save-button' type="submit">Enregistrer</button>
        </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MaintenancePage;
