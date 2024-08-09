import "./Register.css";
import { useState } from "react";
import { Link } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import { useNavigate } from "react-router-dom";
import google from "../../img/goo.png";
import { useUser } from '../../components/contexts/UserContext.jsx';

const Register = () => {
    const navigateTo = useNavigate();
    const { setUsusario } = useUser();
    const [email, setEmail] = useState('');
    const [username, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const clientId = "612029047571-54dp6o7o757atf598qjj7il1mt030nan.apps.googleusercontent.com";

    const validate = () => {
        const newErrors = {};

        // Validación de correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Correo electrónico es requerido.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Correo electrónico no es válido.";
        }

        // Validación de nombre de usuario
        if (!username) {
            newErrors.username = "Nombre de usuario es requerido.";
        } else if (username.length < 3) {
            newErrors.username = "Nombre de usuario debe tener al menos 3 caracteres.";
        } else if (/[^a-zA-Z0-9]/.test(username)) {
            newErrors.username = "Nombre de usuario solo puede contener letras y números.";
        }

        // Validación de contraseña
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!password) {
            newErrors.password = "Contraseña es requerida.";
        } else if (!passwordRegex.test(password)) {
            newErrors.password = "Contraseña debe tener al menos 6 caracteres, incluyendo letras y números.";
        }

        // Validación de confirmación de contraseña
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden.";
        }

        setErrors(newErrors);

        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            let user = {
                email,
                username,
                pass: password
            };
            let response = await fetch("http://localhost:3000/api/users/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            response = await response.json();
            console.log(response);
            if (response.message === "Se ha creado correctamente") {
                let response = await fetch("http://localhost:3000/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                });
                response = await response.json();
                if (response.length > 0) {
                    setUsusario(response[0]);
                    navigateTo("/inicio");
                }
            } 
        }
    };

    const onSucces = async (response) => {
        const { tokenId, googleId, profileObj } = response;
        const user = {
            tokenId,
            googleId,
            email: profileObj.email,
            name: (profileObj.name).replace(/\s+/g, "").toLowerCase(),
            imageUrl: profileObj.imageUrl
        };

        let res = await fetch("http://localhost:3000/api/users/google-login", {
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
                setUsusario(res.user);
                navigateTo("/inicio");
            }
        }

    };

    const onFailure = (response) => {
        console.log(response);
    };

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
                {errors.email && <p className="error">{errors.email}</p>}
                <input
                    placeholder="Usuario"
                    type="text"
                    id="username"
                    value={username}
                    onChange={(event) => setUser(event.target.value)}
                    required
                />
                {errors.username && <p className="error">{errors.username}</p>}
                <input
                    placeholder="Contraseña"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <input
                    placeholder="Confirmar Contraseña"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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
                    clientId={clientId}
                    buttonText="Login"
                    onSuccess={onSucces}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                />
                <img src={google} alt="Google" />
                <h3>Usar Google</h3>
            </button>
            <h2>Ya tienes cuenta?</h2>
            <Link to="/login" className="buttonLink">Iniciar Sesión</Link>
            <div className="btn">
            </div>
        </section>
    );
}

export default Register;
