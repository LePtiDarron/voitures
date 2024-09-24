import React, { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from './../components/Footer';
import './Inventory.css'

interface Inventory {
  quantity: number;
}

const InventoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inventory, setInventory] = useState<Inventory>({ quantity: 0 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInventory({ ...inventory, quantity: parseInt(e.target.value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('quantity', inventory.quantity.toString());
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/inventory/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.href = `/mod/cars/${id}`;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'inventaire :', error);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="inventory-page">
        <div className="inventory-container">
        <h3>Mettre à jour l'inventaire</h3>
        <form className='inventory-form' onSubmit={handleSubmit}>
          <input type="number" name="Quantité" placeholder="Quantité" onChange={handleInputChange} className="quantity-input" required />
          <button className='save-button' type="submit">Enregistrer</button>
        </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InventoryPage;
