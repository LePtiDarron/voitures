import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import './CarDetails.css';
import Footer from './../components/Footer';

interface Comment {
  username: string;
  date: string;
  note: number;
  content: string;
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

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    note: 0,
    content: ''
  });
  const [showError, setShowError] = useState(false); // State for error message

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchCarAndComments = async () => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/${id}`);
        setCar(carResponse.data);

        const commentsResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/comments/${id}`);
        setComments(commentsResponse.data.map((comment: Comment) => ({
          ...comment,
          date: formatDate(comment.date)
        })));
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchCarAndComments();
  }, [id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComment({ ...newComment, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', newComment.content);
      formData.append('note', newComment.note.toString());

      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/api/comments/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        
        const createdComment = {
          ...response.data,
          date: formatDate(response.data.date),
        };
  
        setComments([createdComment, ...comments]);

        setNewComment({ note: 0, content: '' });
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error('Erreur lors de la création du commentaire :', error);
    }
  };

  const handleRentClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `/rent/${id}`;
    } else {
      setShowError(true);
    }
  };

  const handleBuyClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = `/buy/${id}`;
    } else {
      setShowError(true);
    }
  };

  const handleMaintenanceClick = () => {
    window.location.href = `/maintenance/${id}`;
  };

  if (!car) {
    return (
      <div className='page-and-footer'>
        <div className="car-details-container">
          <p>Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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

        <button className='carDetails-button' onClick={handleMaintenanceClick}>Voir la maintenance</button>

        {showError && <div className="error-message">Veuillez vous connecter pour effectuer cette action.</div>}
        
        <div className="comment-section">
          <h3>Commentaires</h3>

          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <div className="textarea-container">
              <div className="rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`star ${star <= newComment.note ? 'filled' : ''}`} onClick={() => setNewComment({ ...newComment, note: star })}>
                    ★
                  </span>
                ))}
              </div>
              <textarea
                name="content"
                placeholder="Votre commentaire"
                value={newComment.content}
                onChange={handleCommentChange}
                required
              />
            </div>
            <button className="comment-submit-button" type="submit">
              Envoyer
            </button>
          </form>

          <div>
            {comments.map((comment, index) => (
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
            ))}
          </div>
        </div>
        
        {car.location ? (
          <button className='carDetails-button' onClick={handleRentClick}>Louer</button>
        ) : (
          <button className='carDetails-button' onClick={handleBuyClick}>Acheter</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CarDetails;
