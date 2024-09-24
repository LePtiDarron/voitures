import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Orders.css';
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

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/orders`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setOrders(response.data);
        }
      } catch (err) {
        setError('Erreur lors de la récupération des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='page-and-footer'>
      <div className='orders-page'>
        <h1>My Orders</h1>
        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>Error: {error}</div>}
        {orders.length === 0 ? (
          <p className='no-orders'>No orders found.</p>
        ) : (
          <ul className='order-list'>
            {orders.map((order) => (
              <Link to={`/profile/orders/${order.id}`} key={order.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className='order-item'>
                  <div className='order-item-content'>
                    <p className='order-item-date'>Commande passée le {new Date(order.date).toLocaleDateString()}</p>
                    <p className='order-item-price'>{order.price}€</p>
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
