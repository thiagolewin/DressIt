import "./Login.css";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import google from "../../img/goo.png";
import { useUser } from '../../components/contexts/UserContext.jsx';

const Login = () => {
    const navigateTo = useNavigate();
    const { setUsuario } = useUser(); // Asegúrate de usar el hook useUser
    const clientId = "612029047571-54dp6o7o757atf598qjj7il1mt030nan.apps.googleusercontent.com";
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const start = () => {
            gapi.auth2.init({
                clientId: clientId
            });
        }
        gapi.load("client:auth2", start);
    }, [clientId]);

    const onSucces = async (response) => {
        const { tokenId, googleId, profileObj } = response;
        const user = {
            tokenId,
            googleId,
            email: profileObj.email,
            name: (profileObj.name).replace(/\s+/g,"").toLowerCase(),
            imageUrl: profileObj.imageUrl
        };
        
        let res = await fetch("https://6f72-2800-40-39-4dc9-dd2b-6ab9-3c47-e4e.ngrok-free.app/api/users/google-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        res = await res.json();
        if(res.message == "Ya hay un user con ese nombre Google") {
            navigateTo("/RegisterUser",{state:{user}})
        } else {
            if (res.user) {
                setUsuario(res.user);
                navigateTo("/inicio");
            }
        }
    };

    const onFailure = (response) => {
        console.log(response);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let user = {
            username: username,
            pass: password
        };

        let response = await fetch("https://6f72-2800-40-39-4dc9-dd2b-6ab9-3c47-e4e.ngrok-free.app/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        response = await response.json();
        console.log(response)
        if (response.length > 0) {
            setUsuario(response[0]); // Usa setUsusario del contexto
            navigateTo("/inicio");
        }
    };

    return (
        <section id="login">
            <h1>DressIt</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Usuario"
                    type="user"
                    id="user"
                    value={username}
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
                <GoogleLogin
                    className="loginGoogle"
                    clientId="612029047571-iitrg3be3j61v7nt8r4dbs9trauir8vp.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={onSucces}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_policy'}
                />
                <img src={google} alt="" />
                <h3>Usar Google</h3>
            </button>
            <h2>¿No tienes cuenta?</h2>
            <Link to="/register" className="buttonLink">Registrarse</Link>
        </section>
    );
}

export default Login;
