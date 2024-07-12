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
            const response = await fetch(`https://dressitnode-uq2eh73iia-uc.a.run.app/api/wear/` + id);
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
        window.open(url, '_blank');
    };

    const irAProbar = (url) => {
        // Codificar la URL de la imagen antes de pasarla como parámetro
        const urlCodificada = encodeURIComponent(url);
        const urlCodificada2 = encodeURIComponent(prenda.link);
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
