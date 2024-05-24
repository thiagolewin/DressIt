import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './pages/Start/Start.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import './App.css';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
  );
}

export default App;