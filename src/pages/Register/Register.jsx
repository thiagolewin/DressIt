import "./Register.css"
import { useState } from "react";
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { gapi } from "gapi-script";
import GoogleLogin from "react-google-login";
const Register = ()=> {
    const handleSubmit = (event) => {
        event.preventDefault();
      };
    const clientID = "460073557739-hrhsjlb71js93grvplklhk7m2j6v8fft.apps.googleusercontent.com" 
    useEffect(()=>{
        const start = () => {
            gapi.auth2.init({
                clientID: clientID,
            })
        }
        gapi.load("client:auth2",start)
    },[])

    const onSuccess = (response)=> {
        console.log(response)
    }
    const onFailure = ()=> {
        console.log("Something went wrong")
    }
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    return (
        <section >
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
                <img src="./src/img/goo.png" alt="" />
                <h3>Usar Google</h3>
            </button>
            <button className="logExtern">
                <img src="./src/img/face.png" alt="" />
                <h3>Usar FaceBook</h3>
            </button>
            <h2>Ya tienes cuenta?</h2>
            <Link to="/login" className="buttonLink">Iniciar Sesión</Link>
            <div className="btn">
            <GoogleLogin 
                clientID={clientID}
                onSuccess= {onSuccess}
                onFailure ={onFailure}
                cookiePolicy={"single_host_policy"}
                />
            </div>
        </section>
    );
}
export default Register