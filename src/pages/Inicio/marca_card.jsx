import { useNavigate } from "react-router-dom";

const MarcaCard = ({id,name,image})=> {
    console.log("aaaaa",id)
    const navigateTo = useNavigate();
    const handlePrendaClick = ()=> {
        navigateTo("/" +id)
    }
    return ( 
    <div className='marca' onClick={handlePrendaClick}>
        <div className='brand-img'>
            <img src={image} alt={name} />
        </div>
    </div>
    )
}
export default MarcaCard