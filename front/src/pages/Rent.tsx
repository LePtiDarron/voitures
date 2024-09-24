import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Box, Typography, Button } from '@mui/material';
import './Rent.css';
import Footer from './../components/Footer';

interface Availability {
  startDate: string;
  endDate: string;
}

interface Inventory {
  quantity: number;
  availability: Availability[];
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

const RentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [numberOfDays, setNumberOfDays] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/cars/${id}`);
        setCar(carResponse.data);
        const inventoryResponse = await axios.get(`${process.env.REACT_APP_BACK_URL}/api/inventory/${id}`);
        setInventory(inventoryResponse.data);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchCarData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const getAvailabilityDates = () => {
    if (!inventory) return [];
    let dates: Date[] = [];
    inventory.availability.forEach((availability) => {
      const start = formatDate(availability.startDate);
      const end = formatDate(availability.endDate);
      let currentDate = start;
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return dates;
  };

  const getAvailabilityRanges = () => {
    return (inventory?.availability.map(avail => [
      formatDate(avail.startDate),
      formatDate(avail.endDate)
    ]) || []) as [Date, Date][];
  };

  const isOverlapping = (range: [Date, Date], existingRanges: [Date, Date][]) => {
    return existingRanges.some(([start, end]) => {
      return range[0] <= end && range[1] >= start;
    });
  };

  const handleRangeChange = (value: [Date, Date]) => {
    if (Array.isArray(value) && value.length === 2) {
      const [startDate, endDate] = value;
      const availabilityRanges = getAvailabilityRanges();

      if (isOverlapping([startDate, endDate], availabilityRanges)) {
        setError('La période sélectionnée chevauche une autre période.');
        setNumberOfDays(null);
        setTotalPrice(null);
      } else {
        setError(null);
        setSelectedRange([startDate, endDate]);
        const days = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;
        setNumberOfDays(days - days % 1);
        if (car) {
          setTotalPrice((days - days % 1) * car.price);
        }
      }
    } else {
      setSelectedRange(null);
      setNumberOfDays(null);
      setTotalPrice(null);
    }
  }

  const handleSubmit = async () => {
    if (selectedRange && car) {
      const [startDate, endDate] = selectedRange;
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setDate(adjustedStartDate.getDate() + 1); // Increment start date by one day

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const formData = new FormData();
          formData.append('IDcar', `${id}`);
          formData.append('startDate', adjustedStartDate.toISOString().split('T')[0]);
          formData.append('endDate', endDate.toISOString().split('T')[0]);
          formData.append('price', `${totalPrice}`);
          formData.append('date', new Date().toISOString().split('T')[0]);
          await axios.post(`${process.env.REACT_APP_BACK_URL}/api/rent`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          setOpen(true);
        }
      } catch (error) {
        setError('Erreur lors de la réservation.');
      }
    } else {
      setError('Veuillez sélectionner une période.');
    }
  };

  const goHome = () => {
    window.location.href = `/`
  };

  if (!car) {
    return <div>Chargement...</div>;
  }

  return (
    <div className='page-and-footer'>
      <div className='rent-page'>
        <style>
          {`
            .unavailable {
              background-color: #FF000080;
              color: black;
              font-weight: bold;
            }
            .selected {
              background-color: blue;
              color: white;
              font-weight: bold;
            }
            .available {
              background-color: #FFFFFF;
              color: black;
              font-weight: bold;
            }
          `}
        </style>
        <h3>Réservation de {car.brand} {car.model}</h3>
        {error && <p className='error-message'>{error}</p>}
        <div>
          <h4>Sélectionnez la période de location :</h4>
          <Calendar
            selectRange
            onChange={(range) => handleRangeChange(range as [Date, Date])}
            tileClassName={({ date }) => {
              const dates = getAvailabilityDates();
              if (dates.find(d => d.getTime() === date.getTime())) {
                return 'unavailable';
              }
              else if (selectedRange && date >= selectedRange[0] && date <= selectedRange[1]) {
                return 'selected';
              } else {
                return 'available';
              }
            }}
          />
          <div className='info-table'>
            {numberOfDays !== null && totalPrice !== null && (
              <table>
                <tbody>
                  <tr>
                    <td>Nombre de jours sélectionnés :</td>
                    <td>{numberOfDays}</td>
                  </tr>
                  <tr>
                    <td>Prix total :</td>
                    <td>{totalPrice}€</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <button className='rent-button' onClick={handleSubmit}>
            Réserver
          </button>
        </div>
        <Modal open={open} onClose={goHome}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" component="h2">
              Réservation réussie !
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Nous vous attendons sur place pour le paiement et la récupération de la voiture.
            </Typography>
            <Button className='ok-button' onClick={goHome} sx={{ mt: 2 }}>
              OK
            </Button>
          </Box>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default RentPage;
