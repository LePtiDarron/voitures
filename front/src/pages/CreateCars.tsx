import React, { useState } from 'react';
import axios from 'axios';
import Footer from './../components/Footer';
import './CreateCars.css'

const CreateCar: React.FC = () => {
  const [newCar, setNewCar] = useState({
    brand: '',
    color: '',
    year: '',
    type: '',
    power: '',
    fuel: '',
    gearBox: '',
    mileage: '',
    model: '',
    description: '',
    price: '',
    pricePerDay: '',
    places: '',
    doors: '',
    category: '',
    pictures: null as FileList | null,
    transactionType: 'vente',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCar({ ...newCar, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewCar({ ...newCar, pictures: e.target.files });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (newCar.transactionType === 'location') {
      newCar.price = newCar.pricePerDay;
    }

    const formData = new FormData();
    Object.entries(newCar).forEach(([key, value]) => {
      if (key === 'pictures' && value) {
        for (let i = 0; i < value.length; i++) {
          formData.append(`pictures[${i}]`, value[i]);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append('location', newCar.transactionType === 'location' ? 'true' : 'false');

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post(`${process.env.REACT_APP_BACK_URL}/api/cars`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.href = '/mod/cars';
      }
    } catch (error) {
      console.error('Erreur lors de la création de la voiture :', error);
    }
  };

  return (
    <div className='create-car-page'>
      <div className="create-car-container">
        <form onSubmit={handleSubmit} className="create-car-form">
          <input type="text" name="brand" placeholder="Marque" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="model" placeholder="Modèle" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="color" placeholder="Couleur" onChange={handleInputChange} className="create-car-input" required />
          <input type="number" name="year" placeholder="Année" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="type" placeholder="Type" onChange={handleInputChange} className="create-car-input" required />
          <input type="number" name="power" placeholder="Puissance" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="fuel" placeholder="Carburant" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="gearBox" placeholder="Boîte de vitesses" onChange={handleInputChange} className="create-car-input" required />
          <input type="number" name="mileage" placeholder="Kilométrage" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="description" placeholder="Description" onChange={handleInputChange} className="create-car-input" required />
          <select name="transactionType" onChange={handleInputChange} className="create-car-select" required>
            <option value="vente">Vente</option>
            <option value="location">Location</option>
          </select>
          {newCar.transactionType === 'vente' && (
            <input type="number" name="price" placeholder="Prix" onChange={handleInputChange} className="create-car-input" required />
          )}
          {newCar.transactionType === 'location' && (
            <input type="number" name="pricePerDay" placeholder="Prix par jour" onChange={handleInputChange} className="create-car-input" required />
          )}
          <input type="number" name="places" placeholder="Places" onChange={handleInputChange} className="create-car-input" required />
          <input type="number" name="doors" placeholder="Portes" onChange={handleInputChange} className="create-car-input" required />
          <input type="text" name="category" placeholder="Catégorie" onChange={handleInputChange} className="create-car-input" required />
          <input type="file" name="pictures" onChange={handleFileChange} className="create-car-file-input" multiple />
          <button type="submit" className="create-car-button">Ajouter la voiture</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateCar;
