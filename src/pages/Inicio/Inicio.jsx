import './Inicio.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import Producto from './Producto.jsx';

async function TraerPrendas(offset, limit) {
    let prendas = await fetch(`http://localhost:3000/api/wear?offset=${offset}&limit=${limit}`);
    prendas = await prendas.json();
    prendas = prendas.filter(element => !(element==null));
    console.log(prendas);
    return prendas;
}

const Inicio = () => {
    const navigateTo = useNavigate();
    const [prendas, setPrendas] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef();

    useEffect(() => {
        cargarPrendas();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        console.log(offset)
        if(offset <82) {
            window.addEventListener('scroll', handleScroll);    
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            cargarPrendas();
        }
    };

    const cargarPrendas = async () => {
        if (loading ) return;
        setLoading(true);
        const prendasObtenidas = await TraerPrendas(offset, 30);
        setPrendas(prevPrendas => [...prevPrendas, ...prendasObtenidas]);
        setOffset(offset + 30);  
        console.log(loading)
        setLoading(false);
    };

    const handlePrendaClick = () => {
        navigateTo("/prenda");
    };

    return (
        <section id='inicio'>
            <div className='tituloMarcas'>
                <h1>DressIt</h1>
                <article className='marcas'>
                <div className='marca'>
                    <img src="./src/img/zara.png" alt="" />
                    <h4>Zara</h4>
                </div>
                <div className='marca'>
                    <img src="./src/img/nike.png" alt="" />
                    <h4>Nike</h4>
                </div>
                <div className='marca'>
                    <img src="./src/img/addidas.png" alt="" />
                    <h4>Addidas</h4>
                </div>
                <div className='marca'>
                    <img src="./src/img/puma.png" alt="" />
                    <h4>Puma</h4>
                </div>
                <div className='marca'>
                    <img src="./src/img/converse.png" alt="" />
                    <h4>Converse</h4>
                </div>
                <div className='marca'>
                    <img src="./src/img/vans.png" alt="" />
                    <h4>Vans</h4>
                </div>
                </article>
                <hr />
            </div>
            <div className='articulos'>
                <button className='buttonLink'>Filtros</button>
                <article className='productos' ref={ref}>
                    {prendas.map(element => (
                        <Producto key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
                    ))}
                    {loading && <div className='width100'><div class="dot-wave">
    <div class="dot-wave__dot"></div>
    <div class="dot-wave__dot"></div>
    <div class="dot-wave__dot"></div>
    <div class="dot-wave__dot"></div>
</div></div>}
                </article>
            </div>
        </section>
    );
};

export default Inicio;
