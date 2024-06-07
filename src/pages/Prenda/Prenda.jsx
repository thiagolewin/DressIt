import './Prenda.css'
import { useNavigate } from "react-router-dom";
const Prenda = ()=> {
    const navigateTo = useNavigate();
    const irALink = (url)=> {
        window.location.href = url
    }
    return (<section id="Prenda">
        <h1>DressIt</h1>
        <hr />
        <img src="./src/img/flecha.svg" alt="" className='flecha'/>
        <h2>Remera oversize Tass</h2>
        <img src="./src/img/remera.jpg" alt=""  className='prenda'/>
        <h3>35.000$</h3>
        <button className='celeste' onClick={() => irALink("https://www.tripstore.com.ar/hombre/indumentaria/remeras-y-musculosas/remera-fila-graphic-sport-f11ht00553-7001.html")}>Pagina del producto</button>
        <button className='negro'>Probar</button>
    </section>)
}
export default Prenda