import './Inicio.css';
import { useState, useEffect, useRef } from 'react';
import Producto from './Producto.jsx';
import { useNavigate } from 'react-router-dom';
import zara from "../../img/zara.png"
import Nike from "../../img/nike.png"
import Addidas from "../../img/addidas.png"
import Puma from "../../img/puma.png"
import Converse from "../../img/converse.png"
import Vans from "../../img/vans.png"
async function TraerPrendas(offset, limit) {
    let prendas = await fetch(`https://dressitnode-uq2eh73iia-uc.a.run.app/api/wear?offset=${offset}&limit=${limit}`);
    prendas = await prendas.json();
    prendas = prendas.filter(element => !(element==null));
    console.log(prendas);
    return prendas;
}

const Inicio = () => {
    const [prendas, setPrendas] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const navigateTo = useNavigate()
    const IrAMarca = (link) => {
        navigateTo(link);
    }
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

    return (
        <section id='inicio'>
            <div className='tituloMarcas'>
                <h1>DressIt</h1>
                <article className='marcas'>
                <div className='marca' onClick={()=>IrAMarca("../zara")}>
                    <img src={zara} alt="" />
                    <h4>Zara</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../nike")}>
                    <img src={Nike} alt="" />
                    <h4>Nike</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../addidas")}>
                    <img src={Addidas} alt="" />
                    <h4>Addidas</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../puma")}>
                    <img src={Puma} alt="" />
                    <h4>Puma</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../converse")}>
                    <img src={Converse} alt="" />
                    <h4>Converse</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../vans")}>
                    <img src={Vans} alt="" />
                    <h4>Vans</h4>
                </div>
                </article>
                <hr />
            </div>
            <div className='articulos'>
                <button className='buttonLink'>Filtros</button>
                <article className='productos' ref={ref}>
                    {prendas.map(element => (
                        <Producto idCreator = {element.idCreator} id={element.id}key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
                    ))}
                    {loading && <div className='width100'><div className="dot-wave">
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
    <div className="dot-wave__dot"></div>
</div></div>}
                </article>
            </div>
        </section>
    );
};

export default Inicio;