import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import EditProfilePicture from './pages/EditProfilePicture';
import ModCars from './pages/ModCars';
import CreateCars from './pages/CreateCars';
import ModCarDetails from './pages/ModCarDetails';
import CarDetails from './pages/CarDetails';
import Maintenance from './pages/Maintenance';
import Inventory from './pages/Inventory';
import Search from './pages/Search';
import Location from './pages/Location';
import Rent from './pages/Rent';
import Buy from './pages/Buy';
import CarMaintenance from './pages/CarMaintenance';
import Selling from './pages/Selling';
import Orders from './pages/Orders';
import OrdersDetails from './pages/OrdersDetails';
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/editpicture" element={<EditProfilePicture />} />
            <Route path="/mod/cars" element={<ModCars />} />
            <Route path="/mod/cars/create" element={<CreateCars />} />
            <Route path="/mod/cars/:id" element={<ModCarDetails />} />
            <Route path="/mod/maintenance/:id" element={<Maintenance />} />
            <Route path="/mod/inventory/:id" element={<Inventory />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/rent/:id" element={<Rent />} />
            <Route path="/buy/:id" element={<Buy />} />
            <Route path="/maintenance/:id" element={<CarMaintenance />} />
            <Route path="/search" element={<Search />} />
            <Route path="/selling" element={<Selling />} />
            <Route path="/location" element={<Location />} />
            <Route path="/profile/orders" element={<Orders />} />
            <Route path="/profile/orders/:id" element={<OrdersDetails />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
