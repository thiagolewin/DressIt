import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
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
    const userId = user ? user.id : 2;
    const navigateTo = useNavigate();

    // Función para buscar marcas y prendas
    const buscarMarcasYPrendas = async () => {
        if (value.trim() === '') {
            setBusqueda({ prendas: [], marcas: [] }); // Reiniciar la búsqueda si el valor es vacío
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${value}/${userId}/6`);
            const data = await response.json();

            console.log("Respuesta de la búsqueda:", data); // Verificar la estructura de data

            // Validación y actualización de estado
            const prendas = data.prendas || [];
            const marcas = data.marcas || [];

            // Actualizamos el estado de busqueda
            setBusqueda({ prendas, marcas });
            console.log("Estado actualizado:", { prendas, marcas }); // Confirmar que el estado se actualiza correctamente

        } catch (error) {
            console.error('Error en la búsqueda:', error);
        } finally {
            setLoading(false);
        }
    };

    // useEffect para manejar la búsqueda al cambiar el valor de 'value'
    useEffect(() => {
        buscarMarcasYPrendas();
    }, [value, userId]); // Ejecutar el efecto cuando 'value' o 'userId' cambien

    // Carga adicional de prendas cuando el usuario llega al final de la página
    const cargarMasPrendas = async () => {
        if (loading || !value) return;
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/search/${value}/${userId}/${offset}/4`);
            const data = await response.json();

            console.log("Respuesta de carga adicional de prendas:", data); // Verificar la respuesta de carga adicional

            if (Array.isArray(data)) {
                const filteredNewArray = data.filter(newItem =>
                    !busqueda.prendas.some(originalItem => originalItem.id === newItem.id)
                );

                if (filteredNewArray.length > 0) {
                    setBusqueda(prev => ({
                        ...prev,
                        prendas: [...prev.prendas, ...filteredNewArray]
                    }));
                    setOffset(prev => prev + 6);
                } else {
                    console.log("No se encontraron nuevas prendas después del filtro.");
                }
            } else {
                console.error('Error: El formato de los datos no es correcto o no hay más prendas.');
            }
        } catch (error) {
            console.error('Error cargando más prendas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Función para navegar al perfil de la marca seleccionada
    const IrAMarca = (username) => {
        navigateTo(`../username/${username}`);
    };

    // Configuración para cargar más prendas cuando se hace scroll al final de la página
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
            cargarMasPrendas();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, value]);

    return (
        <section id="Search">
            <div className='searchBar'>
                <input 
                    type="search" 
                    placeholder='Buscar' 
                    onChange={(event) => setValue(event.target.value)} // Cambia el valor de 'value' directamente
                />
                <h4>Cancelar</h4>
            </div>
            
            <div className='marcas'>
                <h2>Marcas</h2>
                <div className="marcaContainer">
                    {busqueda.marcas.length > 0 ? ( 
                        busqueda.marcas.slice(0, 5).map((Users) => ( 
                            <button 
                                key={`marca-${Users.id}`}  // Uso de key único
                                className='marca' 
                                onClick={() => IrAMarca(Users.username)}
                            >
                                <h4>{Users.username}</h4> 
                            </button>
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
}

export default Search;
