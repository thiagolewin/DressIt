import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../../components/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import "./RegisterUser.css"
const RegisterUser = ()=> {
    const location = useLocation();
    const navigateTo = useNavigate();
  const data  = location.state.user;
  const {email,name,password,confirmPassword} = data
  const { setUsuario } = useUser();
  const [errors, setErrors] = useState({});
  const [errorsView, setErrorsView] = useState("")
  const [newUsername, setNewUsername] = useState('');
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
    if (!newUsername) {
        newErrors.name = "Nombre de usuario es requerido.";
    } else if (newUsername.length < 3) {
        newErrors.name = "Nombre de usuario debe tener al menos 3 caracteres.";
    } else if (/[^a-zA-Z0-9]/.test(newUsername)) {
        newErrors.name = "Nombre de usuario solo puede contener letras y números.";
    }

    // Validación de confirmación de contraseña
    if (password !== confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
};
    const handleSubmit=async(e)=> {
        e.preventDefault()
        validate()
        console.log(errors)
        if(data.length != 0 && validate()) {
            const user = data
            user.name = newUsername
            console.log(user)
            let res = await fetch(" http://localhost:3000/api/users/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            res = await res.json();
            if (res.user) {
                setUsuario(res.user);
                navigateTo("/inicio");
            } else {
                setErrorsView(res.message)
            }
        }
    }
    return (<section id="RegisterUser">
        <form onSubmit={handleSubmit}>
            <h2>Que username quieres usar?</h2>
            <input onChange={(e) => setNewUsername(e.target.value)}></input>
            <input type="submit" />
        </form>
        <h3>{errorsView}</h3>
    </section>)
}
export default RegisterUser