import './Prenda.css'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import flecha from '../../img/flecha.svg'
import { useUser } from '../../components/contexts/UserContext.jsx';

const Prenda = () => {
    const navigateTo = useNavigate();
    const [prenda, setPrenda] = useState(null);
    const { id } = useParams();
    const { user } = useUser();  
    const userId = user ? user.id : 2;

    async function TraerPrenda(id,iduser) {
        console.log(id)
        try {
            const response = await fetch(`http://localhost:3000/api/wear/${id}/${iduser}`);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    useEffect(() => {
        async function cargarPrenda() {
            const data = await TraerPrenda(id,userId);
            setPrenda(data);
        }
        cargarPrenda();
    }, [id]);

    const irALink = (url) => {
        window.open(url, '_blank');
    };

    async function guardarEnHistorial(iduser){
        try {
            console.log(iduser);
            const response = await fetch(`http://localhost:3000/api/users/post-to-history/${iduser}/${prenda.id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            return response;
        }
        catch (error){
            console.log(error);
        }
    }

    const irAProbar = (url) => {
        // Codificar la URL de la imagen antes de pasarla como parámetro
        const urlCodificada = encodeURIComponent(url);
        const urlCodificada2 = encodeURIComponent(prenda.link);
        const guardar = guardarEnHistorial(userId);
        console.log(guardar);
        navigateTo("/probar/" + urlCodificada +"/" + urlCodificada2);
    }

    const irAInicio = () => {
        navigateTo("/inicio");
    }

    const Volver = () => {
        navigateTo(-1);
    }

    if (!prenda) {
        return <section id='Prenda'>
            <h1 onClick={irAInicio}>DressIt</h1>
            <hr />
            <img src={flecha} alt="" className='flecha' onClick={Volver} />
            <div className='width100'><div className="dot-wave">
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
</div></div>
        </section>;
    }

    return (
        <section id="Prenda">
            <h1 onClick={irAInicio}>DressIt</h1>
            <hr />
            <div className='prenda' style={{ backgroundImage: `url(${prenda.imgPath})` }}></div>
            <h2>{prenda.name}</h2>
            <h3>${prenda.price}</h3>
            <button className='celeste' onClick={() => irALink(prenda.link)}>Pagina del producto</button>
            <button className='negro' onClick={() => irAProbar(prenda.imgPath)}>Probar</button>
        </section>
    );
}

export default Prenda;
