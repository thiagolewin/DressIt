import { useNavigate } from "react-router-dom";
const Producto = ({backgroundImageUrl,precio,titulo})=> {
    const navigateTo = useNavigate();
    const handlePrendaClick = ()=> {
        navigateTo("/prenda")
    }
    return ( 
    <div className='producto'  onClick={handlePrendaClick}>
        <div className='productoImg'>
            <img src={backgroundImageUrl} alt="" />
            <h6>{precio}$</h6>
        </div>
        <h3>{titulo}</h3>
    </div>
    )
}
export default Producto