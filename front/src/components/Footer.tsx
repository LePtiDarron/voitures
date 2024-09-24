import { Link } from 'react-router-dom';
import './Footer.css';
import logo from './logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <img src={logo} className="footer-logo" />
        <p>
          Bienvenue chez To-Mobil, votre partenaire de confiance pour la location et la vente de voitures. Que vous recherchiez une voiture pour un court séjour ou un véhicule pour un usage quotidien, nous avons une large gamme de voitures adaptées à tous vos besoins. Notre mission est de vous offrir des services de qualité et des véhicules fiables pour que vos trajets soient toujours agréables et en toute sécurité.
        </p>
      </div>
      <div className="footer-section">
        <h4>NOS SERVICES</h4>
        <ul>
          <li>
            <Link to="/location">Location de voitures</Link>
          </li>
          <li>
            <Link to="/achat">Vente de voitures</Link>
          </li>
        </ul>
      </div>
      <div className="footer-section">
        <h4>COORDONNÉES</h4>
        <ul>
          <li>123 Rue de Paris, 75000 Paris, France</li>
          <li>+33 1 23 45 67 89</li>
          <li>To-mobil@gmail.com</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
