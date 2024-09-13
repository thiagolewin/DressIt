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
import { useUser } from '../../components/contexts/UserContext.jsx';
async function TraerPrendas(offset, limit, user) {
    const userId = user ? user.id : 2;
    let prendas = await fetch(`http://localhost:3000/api/wear/random/${userId}`);
    prendas = await prendas.json();
    prendas = prendas.filter(element => !(element==null));
    return prendas;
}

const Inicio = () => {
    const { user } = useUser();  
    const userId = user ? user.id : 2;
    const [prendas, setPrendas] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    let load = false
    const ref = useRef();
    const navigateTo = useNavigate()
    const IrAMarca = (link) => {
        navigateTo(link);
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        cargarPrendas();
        load = true
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
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight && load ==false) {
            cargarPrendas();
        }
    };

    const cargarPrendas = async () => {
        if (loading ) return;
        setLoading(true);
        const prendasObtenidas = await TraerPrendas(user);
        setPrendas(prevPrendas => [...prevPrendas, ...prendasObtenidas]);
        setOffset(offset + 30);  
        setLoading(false);
    };

    return (
        <section id='inicio'>
            <div className='tituloMarcas'>
                <h1>DressIt</h1>
                <article className='marcas'>
                <div className='marca' onClick={()=>IrAMarca("../username/zara")}>
                    <img src={zara} alt="" />
                    <h4>Zara</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../username/nike")}>
                    <img src={Nike} alt="" />
                    <h4>Nike</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../username/addidas")}>
                    <img src={Addidas} alt="" />
                    <h4>Addidas</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../username/puma")}>
                    <img src={Puma} alt="" />
                    <h4>Puma</h4>
                </div>
                <div className='marca' onClick={()=>IrAMarca("../username/converse")}>
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
                        <Producto idCreator = {element.idCreator} id={element.id}key={"inicio-"+element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
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