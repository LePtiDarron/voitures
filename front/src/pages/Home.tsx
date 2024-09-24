import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';
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

const Home: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/users`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du profil :', error);
      }
    };

    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/carousel`);
        const data = await response.json();
        setResults(data.items);
      } catch (error) {
        setResults([]);
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    fetchUserData();
  }, []);

  const gotoHandleCars = () => {
    window.location.href = '/mod/cars/';
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className='page-and-footer'>
      <div className="home-container">
        <header className="home-header">
          <h1>Bienvenue sur ToMobil</h1>
          <p>Votre destination privilégiée pour l'achat et la location de voitures de qualité.</p>
        </header>

        <h2>Nos Services</h2>
        <div className="services-section">
          <div className="service">
            <h3>Achat de Voitures</h3>
            <p>Nous proposons une large gamme de voitures à la vente, allant des modèles récents aux classiques. Trouvez votre voiture idéale à des prix compétitifs.</p>
          </div>
          <div className="service">
            <h3>Location de Voitures</h3>
            <p>Que vous ayez besoin d'une voiture pour une journée ou un mois, nous avons des options de location flexibles adaptées à vos besoins.</p>
          </div>
        </div>

        <h2>Découvrez Nos Offres</h2>
        {loading === true ? (
          <div>Chargement...</div>
        ) : results.length === 0 ? (
          <div className='error-message'>Erreur.</div>
        ) : (
          <div className="home-carousel-container">
            <Slider {...settings}>
              {results.map((car) => (
                car.pictures.length > 0 && (
                  <div key={car.id}>
                    <a href={`/cars/${car.id}`} className="carousel-link">
                      <img 
                        src={`${process.env.REACT_APP_BACK_URL}/uploads/car_pictures/${car.pictures[0]}`}
                        className="carousel-image"
                      />
                    </a>
                  </div>
                )
              ))}
            </Slider>
          </div>
        )}

        {userData && userData.roles && userData.roles.includes('ADMIN') && (
          <button className="admin-button" onClick={gotoHandleCars}>Gérer les Voitures</button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
