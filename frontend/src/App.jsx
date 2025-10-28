import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewNote from './pages/Newnote';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newNote" element={ <ProtectedRoute> <NewNote /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;