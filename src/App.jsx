import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/Start/Start.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import './App.css';
import Inicio from './pages/Inicio/Inicio.jsx';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inicio" element={<Inicio />} />
        </Routes>
    </Router>
  );
}

export default App;