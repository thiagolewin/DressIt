import './Search.css'
import { useState } from 'react'
import Producto from '../Inicio/Producto.jsx';

const Search = ()=> {
    const [busqueda, setBusqueda] = useState([]);
    const [loading, setLoading] = useState(false);

    const Buscar = async (event) => {
        const value = event.target.value;
        let busqueda = await fetch(`http://localhost:3000/api/wear/search/${value}`);
        busqueda = await busqueda.json();
        busqueda = busqueda.filter(element => !(element==null));
        console.log(busqueda);
        setBusqueda(busqueda);
    }
    return (<section id="Search">
        <div className='searchBar'>
        <input type="search" placeholder='Buscar' onInput={Buscar} />
        
        <h4>Cancelar</h4>
        </div>
        {busqueda.map(element => (
                <Producto idCreator = {element.idCreator} id={element.id}key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
            ))}
            {loading && <div className='width100'><div className="dot-wave">
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            </div></div>}
    </section>)
}
export default Search