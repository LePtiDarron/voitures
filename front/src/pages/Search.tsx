import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './CarList.css';
import './Filters.css';
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

const Search: React.FC = () => {
  const [results, setResults] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const location = useLocation();

  const [brand, setBrand] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [fuel, setFuel] = useState<string>('');
  const [gearBox, setGearBox] = useState<string>('');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [mileageMax, setMileageMax] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('');

  const getQueryParams = (query: string) => {
    return new URLSearchParams(query);
  };

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    setBrand(queryParams.get('brand') || '');
    setYear(queryParams.get('year') || '');
    setType(queryParams.get('type') || '');
    setFuel(queryParams.get('fuel') || '');
    setGearBox(queryParams.get('gearBox') || '');
    setPriceMin(queryParams.get('priceMin') || '');
    setPriceMax(queryParams.get('priceMax') || '');
    setMileageMax(queryParams.get('mileageMax') || '');
    setTransactionType(queryParams.get('transactionType') || '');
  }, [location.search]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const queryParams = getQueryParams(location.search);

      if (queryParams.get('query')) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/search?${queryParams.toString()}&page=${page}`);
          const data = await response.json();
          setResults(data.items);
          setTotalPages(data.pages);
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search, page]);

  const handleSearch = () => {
    const params = new URLSearchParams(location.search);
    if (brand) params.set('brand', brand); else params.delete('brand');
    if (year) params.set('year', year); else params.delete('year');
    if (type) params.set('type', type); else params.delete('type');
    if (fuel) params.set('fuel', fuel); else params.delete('fuel');
    if (gearBox) params.set('gearBox', gearBox); else params.delete('gearBox');
    if (priceMin) params.set('priceMin', priceMin); else params.delete('priceMin');
    if (priceMax) params.set('priceMax', priceMax); else params.delete('priceMax');
    if (mileageMax) params.set('mileageMax', mileageMax); else params.delete('mileageMax');
    if (transactionType) params.set('transactionType', transactionType); else params.delete('transactionType');

    const newUrl = `/search?${params.toString()}`;
    window.history.pushState({}, '', newUrl);

    setPage(1);
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}/api/search?${params.toString()}&page=1`);
        const data = await response.json();
        setResults(data.items);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  };

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
      <div className='main-page'>
        <div className='filters'>
          <div className='filters-container'>
            <input type="text" placeholder="Marque" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <input type="number" placeholder="Année" value={year} onChange={(e) => setYear(e.target.value)} />
            <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
            <input type="text" placeholder="Carburant" value={fuel} onChange={(e) => setFuel(e.target.value)} />
            <input type="text" placeholder="Boîte de vitesses" value={gearBox} onChange={(e) => setGearBox(e.target.value)} />
            <input type="number" placeholder="Prix min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
            <input type="number" placeholder="Prix max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            <input type="number" placeholder="Kilométrage max" value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} />
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="">Sélectionner</option>
              <option value="location">Location</option>
              <option value="achat">Achat</option>
            </select>
          </div>
          <button className='apply-button' onClick={handleSearch}>Appliquer</button>
        </div>
        {loading === true ? (
          <div>Chargement...</div>
        ) : results.length === 0 ? (
          <div>Aucun résultat trouvé pour votre recherche.</div>
        ) : (
          <div>
            {results.map((car) => (
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
        )}
      </div>
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={page === 1}>Page précédente</button>
        <button onClick={handleNextPage} disabled={page === totalPages}>Page suivante</button>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
