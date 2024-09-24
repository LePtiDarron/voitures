import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Box, Typography, Button } from '@mui/material';
import './Rent.css';
import Footer from './../components/Footer';

interface Car {
  id: number;
  brand: string;
  color: string;
  year: number;
  type: string;
  power: number;
  fuel: string;
  gearBox: string;
  mileage: number;
  model: string;
  description: string;
  price: number;
  places: number;
  doors: number;
  category: string;
  pictures: string[];
  location: boolean;
}

const BuyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/${id}`);
        setCar(carResponse.data);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchCarData();
  }, [id]);

  const goHome = () => {
    window.location.href = `/`;
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const formData = new FormData();
        formData.append('IDcar', `${id}`);
        formData.append('price', `${car?.price}`);
        formData.append('date', new Date().toISOString().split('T')[0]);
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/buy`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setOpen(true);
      }
    } catch (error) {
      setError("Erreur lors de l'achat");
    }
  };

  if (!car) {
    return <div className="rent-page">Chargement...</div>;
  }

  return (
    <div className='page-and-footer'>
      <div className="rent-page">
        <h3>Achat de {car.brand} {car.model}</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="info-table">
          <table>
            <tbody>
              <tr>
                <td>Prix :</td>
                <td>{car.price}€</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="rent-button" onClick={handleSubmit}>
          Acheter
        </button>
        <Modal open={open} onClose={goHome}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="h2">
              Merci pour votre achat
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Nous vous attendons sur place pour le paiement et la récupération de la voiture.
            </Typography>
            <Button className="ok-button" onClick={goHome} sx={{ mt: 2 }}>
              OK
            </Button>
          </Box>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default BuyPage;
