import { useNavigate } from 'react-router-dom'; 

const Marca = ({ idMarca, username }) => {
    const navigate = useNavigate(); 

    const handleMarcaClick = () => {
        navigate(`/marca/${idMarca}`); 
    }

    return (
        <div className='marca' onClick={handleMarcaClick}>
            <h3>{username}</h3>
        </div>
    );
}

export default Marca;
