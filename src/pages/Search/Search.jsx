import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';

const Search = () => {
    const [busqueda, setBusqueda] = useState({ prendas: [], marcas: [] });
    const [offset, setOffset] = useState(0); // Para la paginación
    const [loading, setLoading] = useState(false);
    const { user } = useUser();  

    const userId = user ? user.id : 2; // Usa el id del usuario o un valor por defecto (2)

    const Buscar = async (event) => {
        const value = event.target.value;
        setOffset(0); // Reiniciar el offset cuando se realiza una nueva búsqueda
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/wear/search/${value}/${userId}/5`);
            const data = await response.json();
            
            console.log("Respuesta de la búsqueda:", data);
            if (data && data.prendas && data.marcas) {
                setBusqueda({ prendas: data.prendas, marcas: data.marcas });
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar más prendas al hacer scroll
    const cargarMasPrendas = async () => {
        if (loading) return; // Evitar múltiples solicitudes
        setLoading(true);
        const value = document.querySelector('.searchBar input').value;
        try {
            const response = await fetch(`http://localhost:3000/api/wear/search/${value}/${offset}/5`);
            const data = await response.json();

            if (data && Array.isArray(data.prendas)) {
                // Filtrar las prendas que ya están en la lista
                const nuevasPrendas = data.prendas.filter(prenda => 
                    !busqueda.prendas.some(existingPrenda => existingPrenda.id === prenda.id)
                );

                setBusqueda(prev => ({
                    ...prev,
                    prendas: [...prev.prendas, ...nuevasPrendas]
                }));
                setOffset(prev => prev + 5);
            }
        } catch (error) {
            console.error('Error cargando más prendas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                cargarMasPrendas();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset, loading]);

    return (
        <section id="Search">
            <div className='searchBar'>
                <input type="search" placeholder='Buscar' onInput={Buscar} />
                <h4>Cancelar</h4>
            </div>
            
            {/* Sección Marcas */}
            <div className='marcas'>
                <h2>Marcas</h2>
                <div className="marcaContainer">
                    {busqueda.marcas.slice(0, 5).map((marca, index) => (
                        <div key={index} className='marca'>
                            <h4>{marca.nombre}</h4>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Sección Prendas */}
            <div className='prendas'>
                <h2>Prendas</h2>
                <div className="productos">
                    {busqueda.prendas.map(element => (
                        <Producto idCreator={element.idCreator} id={element.id} key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
                    ))}
                </div>
            </div>

            {loading && <div className='width100'><div className="dot-wave">
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
                <div className="dot-wave__dot"></div>
            </div></div>}
        </section>
    );
}

export default Search;
