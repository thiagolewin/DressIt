import './Inicio.css';
import { useState, useEffect, useRef } from 'react';
import Producto from './Producto.jsx';
import MarcaCard from './marca_card.jsx';

async function TraerPrendas(offset, limit) {
    let prendas = await fetch(`http://localhost:3000/api/wear?offset=${offset}&limit=${limit}`);
    prendas = await prendas.json();
    prendas = prendas.filter(element => !(element==null));
    console.log(prendas);
    return prendas;
}
async function TraerMarcas() {
    let marcas = await fetch(`http://localhost:3000/api/brand/`);
    marcas = await marcas.json();
    marcas = marcas.filter(element => !(element==null));
    console.log(marcas);
    return marcas;
}

const Inicio = () => {
    const [prendas, setPrendas] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef();

    useEffect(() => {
        cargarPrendas();
        cargarMarcas();
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

    const cargarMarcas = async () => {
        if (loading) return;
        setLoading(true);
        const marcasObtenidas = await TraerMarcas();
        setMarcas(marcasObtenidas);
        console.log(marcasObtenidas);
        console.log(loading)
        setLoading(false);
    };

    return (
        <section id='inicio'>
            <div className='tituloMarcas'>
            {marcas.map(element => (
                <MarcaCard key={element.id} id={element.id} name={element.name} image={element.logo}/>
            ))}

            {loading && 
            <div className='width100'>
                <div className="dot-wave">
                    <div className="dot-wave__dot"></div>
                    <div className="dot-wave__dot"></div>
                    <div className="dot-wave__dot"></div>
                    <div className="dot-wave__dot"></div>
                </div>
            </div>
            }
            </div>
            <div className='articulos'>
                <button className='buttonLink'>Filtros</button>
                <article className='productos' ref={ref}>
                {prendas.map(element => (
                    <Producto idCreator = {element.idCreator} id={element.id}key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
                ))}
                {loading && 
                <div className='width100'>
                    <div className="dot-wave">
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                    </div>
                </div>
                }
                </article>
            </div>
        </section>
    );
};

export default Inicio;
