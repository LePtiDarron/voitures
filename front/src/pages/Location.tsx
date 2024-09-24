import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CarList.css';
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

const Location: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/location`, {
          params: { page }
        });
        setCars(response.data.items);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error('Erreur lors de la récupération des voitures :', error);
      }
    };

    fetchCars();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className='page-and-footer'>
      <div className="main-page">
        {cars.map((car) => (
          <Link to={`/cars/${car.id}`} key={car.id} className="car-item">
          <div className="car-item-image">
            <img
              src={`${process.env.REACT_APP_BACK_URL}/uploads/car_pictures/${car.pictures[0]}`}
            />
          </div>
          <div className="car-item-details">
            <div className="car-item-price">
              {car.location ? `${car.price} €/jour` : `${car.price} €`}
            </div>
            <div className="car-item-title">
              <span className="car-item-brand-model">{car.brand} {car.model} ({car.year})</span>
              <span className="car-item-description">{car.description}</span>
            </div>
          </div>
        </Link>
        ))}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={page === 1}>Page précédente</button>
        <button onClick={handleNextPage} disabled={page === totalPages}>Page suivante</button>
      </div>
      <Footer />
    </div>
  );
};

export default Location;
