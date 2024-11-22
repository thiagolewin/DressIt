import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/wear';
const INITIAL_OFFSET = 9;

const Search = () => {
    const [busqueda, setBusqueda] = useState({ prendas: []});
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [loading, setLoading] = useState(false);
    const [recientes, setRecientes] = useState([]); 
    const [value, setValue] = useState('');
    const { user } = useUser();

    const userId = user?.id ?? 3; // Asegúrate de tener un valor válido para el userId

    console.log("user:", user);
    console.log("userId:", userId);
    
    useEffect(() => {
        const fetchRecientes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/history/${userId}`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener las búsquedas recientes.');
                }  
                const data = await response.json();
                setRecientes(data); 
            } catch (error) {
                console.error("Error al obtener las búsquedas recientes:", error);
            }
        };
            if (userId) {
            fetchRecientes();
        }
    }, [userId]);

    const bloquearBusqueda = async (searchId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/block/${searchId}`, {
                method: 'PUT',
            });
            if (response.ok) {
                // Eliminamos la búsqueda bloqueada de la lista
                setRecientes(prevRecientes => prevRecientes.filter(busqueda => busqueda.id !== searchId));
            } else {
                console.error('No se pudo bloquear la búsqueda.');
            }
        } catch (error) {
            console.error("Error al bloquear la búsqueda:", error);
        }
    };

    const buscarPrendas = async () => {
        if (value.trim() === '') {
            setBusqueda({ prendas: []});
            return;
        }

        setLoading(true);
        try {
            const response = await(`${API_BASE_URL}/search/${value}/${userId}/6`);
            const data = await response.json();

            const prendas = data.prendas || [];

            // Actualizamos el estado sin sobrescribir lo que ya tenemos
            setBusqueda(prev => ({
                prendas: prendas.length > 0 ? prendas : prev.prendas,
            }));
        } catch (error) {
            console.error("Error en la búsqueda:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && value.trim() !== '') {  // Asegura que haya un usuario y que el valor no esté vacío
            buscarPrendas();
        }
    }, [value]);

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

            <div className='recientes'>
                <h2>Búsquedas Recientes</h2>
                <ul>
                    {recientes.map(busqueda => (
                        <li key={busqueda.id}>
                            {busqueda.search}
                            <button onClick={() => bloquearBusqueda(busqueda.id)}>X</button>
                        </li>
                    ))}
                </ul>
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
