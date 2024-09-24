import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './OrdersDetails.css';
import Footer from './../components/Footer';

interface Order {
  id: number;
  price: number;
  IDcar: number;
  type: string;
  date: string;
  startDate: string;
  endDate: string;
}

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

const OrdersDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<String>("VEHICULE INDISPONIBLE");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/orders/${id}`);
          setOrder(response.data);
          if (response.data.IDcar) {
            fetchCar(response.data.IDcar);
          }
        }
      } catch (err) {
        setError('Erreur lors de la récupération de la commande.');
      } finally {
        setLoading(false);
      }
    };
  
    const fetchCar = async (IDcar: number) => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/${IDcar}`);
        if (carResponse.data) {
          setTitle(`${carResponse.data.brand} ${carResponse.data.model}`);
        } else {
          setTitle(`VEHICULE INDISPONIBLE`);
        }
      } catch (error) {
        console.error('Voiture non disponible');
      }
    };
  
    fetchOrders();
  }, [id]);

  if (loading) {
    return <div className='loading-message'>Chargement...</div>;
  }

  if (error) {
    return <div className='error-message'>Erreur: {error}</div>;
  }

  return (
    <div className='page-and-footer'>
      <div className='orders-details-page'>
        <h3>Details de la commande</h3>
        {order === null ? (
          <p>Order not found.</p>
        ) : (
          <div className='order-details-container'>
            {order.type === "rent" ? (
              <p className='order-type'>Location de {title} du {new Date(order.startDate).toLocaleDateString()} au {new Date(order.endDate).toLocaleDateString()}</p>
            ) : (
              <p className='order-type'>Achat de {title}</p>
            )}
            <p className='order-date'>Date de la commande: {new Date(order.date).toLocaleDateString()}</p>
            <p className='order-amount'>Prix de la commande: {order.price}€</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrdersDetails;
