import "./Login.css"
import { useState } from "react";
import { Link } from 'react-router-dom';
const Login = ()=> {
    const handleSubmit = (event) => {
        event.preventDefault();
      };
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    return (
        <section >
            <h1>DressIt</h1>
            <form onSubmit={handleSubmit}>
            <input
            placeholder="Usuario"
            type="user"
            id="user"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            required
            />
             <input
            placeholder="Contraseña"
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            />
            <Link to="/Olvide" className="link">Olvidaste tu contraseña?</Link>
            <button type="submit">Iniciar sesión</button>
            </form>
            <div className="Barra">
                <hr />
                o
                <hr />
            </div>
            <button className="logExtern">
                <img src="./src/img/goo.png" alt="" />
                <h3>Usar Google</h3>
            </button>
            <button className="logExtern">
                <img src="./src/img/face.png" alt="" />
                <h3>Usar FaceBook</h3>
            </button>
            <h2>¿No tienes cuenta?</h2>
            <Link to="/register" className="buttonLink">Registrarse</Link>
        </section>
    );
}
export default Login