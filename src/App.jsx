import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Start from './pages/Start/Start.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import './App.css';
import Inicio from './pages/Inicio/Inicio.jsx';
import NavBar from './pages/NavBar/NavBar.jsx';
import Search from './pages/Search/Search.jsx';
import Prenda from './pages/Prenda/Prenda.jsx';
import Probar from './pages/Probar/Probar.jsx';
import Result from './pages/Result/Result.jsx';
import Perfil from './pages/Perfil/Perfil.jsx';
import RegisterUser from './pages/RegisterUser/RegisterUser.jsx';
import { UserProvider } from './components/contexts/UserContext.jsx';

function App() {
  return (
    <Router>
      <UserProvider>
        <Main />
      </UserProvider>
    </Router>
  );
}

function Main() {
  const location = useLocation();
  const pathnameParts = location.pathname.split('/');
  const newPathname = pathnameParts.slice(0, 2).join('/');
  const hideNavBar = ['/', '/login', '/register', '/probar',"/RegisterUser"].includes(newPathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/:user/:id" element={<Prenda />} />
        <Route path="/probar/:img/:site" element={<Probar/>} />
        <Route path="/result/:img" element={<Result/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/search" element={<Search />} />
        <Route path='/username/:user' element={<Perfil/>}></Route>
        <Route path='/RegisterUser' element={<RegisterUser/>}></Route>
      </Routes>
      {!hideNavBar && <NavBar />}
    </>
  );
}

export default App;
