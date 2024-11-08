import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import Marca from '../Inicio/Marca.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/wear';
const INITIAL_OFFSET = 9;

const Search = () => {
    const [busqueda, setBusqueda] = useState({ prendas: [], marcas: [] });
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('');
    const { user } = useUser();
    const navigate = useNavigate(); 

    const userId = user?.id ?? 2; // Usa el ID del usuario, o un valor por defecto (2)

    console.log("user:", user);
    console.log("userId:", userId);

    const buscarMarcasYPrendas = async () => {

        if (value.trim() === '') {
            setBusqueda({ prendas: [], marcas: [] });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${value}/${userId}/6`);
            const data = await response.json();

            const prendas = data.prendas || [];
            const marcas = data.marcas || [];

            setBusqueda({ prendas, marcas });
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("user:", user);
        console.log("userId:", userId);

        if (user) {
            buscarMarcasYPrendas();
        }
    }, [value, user]); 

    const cargarMasPrendas = async () => {
        
        if (loading || !value) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/search/${value}/${userId}/${offset}/4`);
            const data = await response.json();

            if (Array.isArray(data)) {
                const filteredNewArray = data.filter(newItem =>
                    !busqueda.prendas.some(originalItem => originalItem.id === newItem.id)
                );

                if (filteredNewArray.length > 0) {
                    console.log("Paso 13: Nuevas prendas obtenidas:", filteredNewArray);
                    setBusqueda(prev => ({
                        ...prev,
                        prendas: [...prev.prendas, ...filteredNewArray]
                    }));
                    setOffset(prev => prev + 6);
                }
            }
        } catch (error) {
            console.error("Error cargando más prendas:", error);
        } finally {
            setLoading(false);
            console.log("Paso 14: Carga de más prendas completada. Estado de carga:", loading);
        }
    };

    const IrAMarca = (username) => {
        console.log("Paso 15: Navegando a la marca:", username);
        navigate(`../username/${username}`);
    };

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
            console.log("Paso 16: Usuario llegó al final de la página, cargando más prendas.");
            cargarMasPrendas();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    return (
        <section id="Search">
            <div className='searchBar'>
                <input 
                    type="search" 
                    placeholder='Buscar' 
                    onChange={(event) => {
                        console.log("Paso 17: Actualización del valor de búsqueda:", event.target.value);
                        setValue(event.target.value);
                    }}
                />
                <h4>Cancelar</h4>
            </div>
            
            <div className='marcas'>
                <h2>Marcas</h2>
                <div className="marcaContainer">
                    {busqueda.marcas.length > 0 ? (
                        busqueda.marcas.slice(0, 5).map((marca) => (
                            <Marca 
                                key={`marca-${marca.id}`} 
                                idMarca={marca.id} 
                                username={marca.username} 
                                onClick={() => IrAMarca(marca.username)}
                            />
                        ))
                    ) : (
                        <p>No hay marcas disponibles.</p>
                    )}
                </div>
            </div>

            <div className='prendas'>
                <h2>Prendas</h2>
                <div className="productos">
                    {busqueda.prendas.map(element => (
                        <Producto 
                            idCreator={element.idCreator} 
                            id={element.id} 
                            key={element.id} 
                            backgroundImageUrl={element.imgPath} 
                            precio={element.price} 
                            titulo={element.name} 
                        />
                    ))}
                </div>
            </div>

            {loading && (
                <div className='width100'>
                    <div className="dot-wave">
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                        <div className="dot-wave__dot"></div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Search;
