import { useState, useEffect, useRef } from 'react';
import Producto from '../Inicio/Producto';

async function TraerPrendas(id) {
    let prendas = await fetch(`http://localhost:3000/api/wear/brand/${id}`);
    prendas = await prendas.json();
    console.log("prendas ", prendas)
    prendas = prendas.filter(element => !(element==null));
    console.log(prendas);
    return prendas;
}

const actualUrl = window.location.href;
const myArray = actualUrl.split("/");
const idMarca = myArray[(myArray.length)-1]



const Marca = () => {
    const [prendas, setPrendas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const ref = useRef();

    const cargarPrendas = async () => {
        if (loading ) return;
        setLoading(true);
        const prendasObtenidas = await TraerPrendas(2);
        console.log("marca ",idMarca)
        console.log("url ",actualUrl)
        setPrendas(prevPrendas => [...prevPrendas, ...prendasObtenidas]);
        setOffset(offset + 30);  
        console.log(loading)
        setLoading(false);
    };

    useEffect(() => {
        cargarPrendas();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
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
    return(
        <div>
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
        </div>
    )
}

export default Marca;