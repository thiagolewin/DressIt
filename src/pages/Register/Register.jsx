import "./Register.css"
import { useState } from "react";
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { useNavigate } from "react-router-dom";
import google from "../../img/goo.png"
const Register = ()=> {
    const navigateTo = useNavigate();
    const respuestaGoogle=()=> {
        navigateTo("/inicio");
    }
    const handleSubmit = (event) => {
        event.preventDefault();
      };

    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    return (
        <section id="Register">
            <h1>DressIt</h1>
            <form onSubmit={handleSubmit}>
            <input
            placeholder="Correo electronico"
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            />
            <input
            placeholder="Nombre Completo"
            type="nombre"
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
            />
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
            <button type="submit">Registrarse</button>
            </form>
            <div className="Barra">
                <hr />
                o
                <hr />
            </div>
            <button className="logExtern">
            <GoogleLogin
                className="loginGoogle"
                clientId="612029047571-iitrg3be3j61v7nt8r4dbs9trauir8vp.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={respuestaGoogle}
                onFailure={respuestaGoogle}
                cookiePolicy={'single_host_origin'}
            />
                <img src={google} alt="" />
                <h3>Usar Google</h3>
              
            </button>
            <h2>Ya tienes cuenta?</h2>
            <Link to="/login" className="buttonLink">Iniciar Sesión</Link>
            <div className="btn">
            </div>
        </section>
    );
}
export default Register