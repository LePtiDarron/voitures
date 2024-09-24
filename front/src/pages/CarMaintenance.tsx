import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CarMaintenance.css';
import Footer from './../components/Footer';

interface Maintenance {
  date: string;
  description: string;
}

const MaintenancePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/maintenance/${id}`);
        setMaintenance(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la maintenance :', error);
      }
    };

    fetchMaintenance();
  }, [id]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (maintenance.length === 0) {
    return (
      <div className='page-and-footer'>
        <div className="maintenance-page">
          <div className="maintenance-container">
          <div className="no-maintenance">Aucune maintenance trouvée pour cette voiture.</div>;
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='page-and-footer'>
      <div className="maintenance-page">
        <div className="maintenance-container">
          <h3>Maintenance</h3>
          <div className='maintenance-form'>
            {maintenance.map((maint, index) => (
              <div key={index} className="maintenance-item">
                <p>{formatDate(maint.date)}</p>
                <p>{maint.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MaintenancePage;
