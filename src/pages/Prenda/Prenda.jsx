import './Prenda.css'
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import flecha from '../../img/flecha.svg'

const Prenda = () => {
    const navigateTo = useNavigate();
    const [prenda, setPrenda] = useState(null);
    const { id } = useParams();

    async function TraerPrenda(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/wear/` + id);
            const data = await response.json();
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    useEffect(() => {
        async function cargarPrenda() {
            const data = await TraerPrenda(id);
            setPrenda(data);
        }
        cargarPrenda();
    }, [id]);

    const irALink = (url) => {
        window.location.href = url;
    }

    const irAProbar = (url) => {
        // Codificar la URL de la imagen antes de pasarla como parámetro
        const urlCodificada = encodeURIComponent(url);
        navigateTo("/probar/" + urlCodificada);
    }

    const irAInicio = () => {
        navigateTo("/inicio");
    }

    const Volver = () => {
        navigateTo(-1);
    }

    if (!prenda) {
        return <div>Cargando...</div>;
    }

    return (
        <section id="Prenda">
            <h1 onClick={irAInicio}>DressIt</h1>
            <hr />
            <img src={flecha} alt="" className='flecha' onClick={Volver} />
            <h2>{prenda.name}</h2>
            <img src={prenda.imgPath} alt="" className='prenda' />
            <h3>${prenda.price}</h3>
            <button className='celeste' onClick={() => irALink(prenda.link)}>Pagina del producto</button>
            <button className='negro' onClick={() => irAProbar(prenda.imgPath)}>Probar</button>
        </section>
    );
}

export default Prenda;
