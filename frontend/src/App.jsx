import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewNote from './pages/Newnote';
import ReadNote from './pages/ReadNote';
import EditNote from './pages/EditNote';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/newNote" element={ <ProtectedRoute> <NewNote /> </ProtectedRoute>} />
        <Route path="/note/:id" element={ <ProtectedRoute> <ReadNote /> </ProtectedRoute>} />
        <Route path="/editNote/:id" element={ <ProtectedRoute> <EditNote /> </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;