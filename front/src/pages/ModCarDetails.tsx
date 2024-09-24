import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from './../components/Footer';
import Slider from 'react-slick';

interface Comment {
  id: number;
  date: string;
  note: number;
  content: string;
  username: string;
}

interface Maintenance {
  date: string;
  description: string;
}

interface Inventory {
  quantity: number;
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

const ModCarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [inventory, setInventory] = useState<Inventory | null>(null);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/${id}`);
        setCar(carResponse.data);

        const maintenanceResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/maintenance/${id}`);
        setMaintenance(maintenanceResponse.data.map((maint: Maintenance) => ({
          ...maint,
          date: formatDate(maint.date),
        })));

        const commentsResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/comments/${id}`);
        setComments(commentsResponse.data.map((comment: Comment) => ({
          ...comment,
          date: formatDate(comment.date),
        })));

        const inventoryResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/inventory/${id}`);
        setInventory(inventoryResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Erreur lors de la suppression du commentaire :', error);
    }
  };

  const handleDeleteCar = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/api/cars/${id}`);
      window.location.href = '/mod/cars';
    } catch (error) {
      console.error('Erreur lors de la suppression de la voiture :', error);
    }
  };

  const addMaintenance = () => {
    window.location.href = `/mod/maintenance/${id}`;
  };

  const addInventory = () => {
    window.location.href = `/mod/inventory/${id}`;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!car) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='page-and-footer'>
      <div className="car-details-container">
        <div className="car-slider">
          {car.pictures.length > 1 ? (
            <Slider {...sliderSettings}>
              {car.pictures.map((picture, index) => (
                <div key={index}>
                  <img
                    src={`${process.env.REACT_APP_BACK_URL}/uploads/car_pictures/${picture}`}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="single-image">
              <img
                src={`${process.env.REACT_APP_BACK_URL}/uploads/car_pictures/${car.pictures[0]}`}
              />
            </div>
          )}
        </div>

        <div className="car-info">
          <h4>{car.brand} {car.model} ({car.year})</h4>
          <p className="price">{car.location ? `${car.price} €/jour` : `${car.price} €`}</p>
          <p><strong>Type:</strong> {car.type}</p>
        </div>

        <div className="car-description">
          <h5>Description</h5>
          <div className='answer-container'>
            <p>{car.description}</p>
          </div>
        </div>

        <div className="car-specifications">
          <h5>Caractéristiques Techniques</h5>
          <div className='answer-container'>
            <table>
              <tbody>
                <tr>
                  <td><strong>Kilométrage:</strong></td>
                  <td>{car.mileage} km</td>
                </tr>
                <tr>
                  <td><strong>Boîte:</strong></td>
                  <td>{car.gearBox}</td>
                </tr>
                <tr>
                  <td><strong>Portes:</strong></td>
                  <td>{car.doors}</td>
                </tr>
                <tr>
                  <td><strong>Places:</strong></td>
                  <td>{car.places}</td>
                </tr>
                <tr>
                  <td><strong>Puissance:</strong></td>
                  <td>{car.power} CV</td>
                </tr>
                <tr>
                  <td><strong>Carburant:</strong></td>
                  <td>{car.fuel}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h3>Maintenance</h3>
        <div className='admin-carInfo'>
          {maintenance.length === 0 ? (
            <p>Aucune maintenance trouvée pour cette voiture.</p>
          ) : (
            <div>
              {maintenance.map((maint, index) => (
                <div key={index}>
                  <p><strong>Date:</strong> {maint.date}</p>
                  <p><strong>Description:</strong> {maint.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className='admin-carDetails-button' onClick={addMaintenance}>Ajouter un entretien</button>

        <h3>Inventaire</h3>
        <div className='admin-carInfo'>
          {inventory === null ? (
            <p>Inventaire non disponible.</p>
          ) : (
            <div>
              <p><strong>Quantité:</strong> {inventory.quantity}</p>
            </div>
          )}
        </div>
        <button className='admin-carDetails-button' onClick={addInventory}>Mettre à jour l'inventaire</button>

        <div className="comment-section">
          <h3>Commentaires</h3>
          <div>
            {comments.map((comment, index) => (
              <div>
                <div key={index} className="comment">
                  <div className="comment-header">
                    <div className="date">
                      <p>{comment.date}</p>
                    </div>
                    <div className="username">
                      <p>{comment.username}</p>
                    </div>
                    <div className="rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`star ${star <= comment.note ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="content">{comment.content}</p>
                </div>
                <button className='admin-com-delete' onClick={() => handleDeleteComment(comment.id)}>Supprimer ce commentaire</button>
              </div>
            ))}
          </div>
        </div>

        <button className='admin-car-delete' onClick={handleDeleteCar}>Supprimer la voiture</button>
      </div>
      <Footer />
    </div>
  );
};

export default ModCarDetails;
