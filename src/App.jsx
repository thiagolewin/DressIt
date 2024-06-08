import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Start from './pages/Start/Start.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import './App.css';
import Inicio from './pages/Inicio/Inicio.jsx';
import NavBar from './pages/NavBar/NavBar.jsx';
import Search from './pages/Search/Search.jsx';
import Prenda from './pages/Prenda/Prenda.jsx';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const hideNavBar = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/search" element={<Search />} />
        <Route path="/prenda" element={<Prenda />} />
      </Routes>
      {!hideNavBar && <NavBar />}
    </>
  );
}

export default App;
