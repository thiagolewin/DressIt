import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';
import PropTypes from 'prop-types';

const API_BASE_URL = 'http://localhost:3000/api/wear'; // Asegúrate de que esta dirección coincida con el backend

const Search = () => {
    const [searchResults, setSearchResults] = useState({ prendas: [] });
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolleo, setScrolleo] = useState(false);  // Estado para detectar scroll
    const { user } = useUser();
    const userId = user?.id || 3;
    let lastScrollY = 0;

    useEffect(() => {
        if (userId) fetchRecentSearches();
    }, [userId]);

    // Detectar el scroll en el useEffect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && !scrolleo) {
                setScrolleo(true); // Cambiar el estado a true cuando se detecte el scroll hacia abajo
                agregarSearch(searchQuery); // Agregar la búsqueda
            }
            lastScrollY = currentScrollY; // Actualizar la posición del scroll
        };

        // Añadir el listener de scroll
        window.addEventListener("scroll", handleScroll);

        // Limpiar el event listener cuando el componente se desmonte
        return () => window.removeEventListener("scroll", handleScroll);
    }, [scrolleo, searchQuery]); // Dependencias: actualizar si cambia scrolleo o searchQuery

    const actualizarEstado = (e) => {
        setScrolleo(false)
        setSearchQuery(e.target.value);
    };

    const agregarSearch = async () => {
        if (searchQuery !== "") {
            
            const response2 = await fetch(`http://localhost:3000/api/wear/history/add/${searchQuery}/${userId}`);
            const response = await fetch(`http://localhost:3000/api/wear/history/${userId}`);
            if (!response.ok) throw new Error('Error al buscar prendas');
            const data = await response.json();
            setRecentSearches(data);
        }
    };

    // Obtener el historial reciente
    const fetchRecentSearches = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/${userId}`);
            if (!response.ok) throw new Error('Error al obtener búsquedas recientes');
            const data = await response.json();
            setRecentSearches(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    // Buscar resultados de prendas
    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/wear/search/${searchQuery}/${userId}/6`);
            if (!response.ok) throw new Error('Error al buscar prendas');
            const data = await response.json();
            setSearchResults({ prendas: data.prendas || [] });
        } catch (error) {
            console.error('Error al buscar prendas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSearchResults(); // Llamar a la búsqueda cuando hay texto
    }, [searchQuery]); // Ejecutar al cambiar la query

    return (
        <section id="Search">
            <div className="searchBar">
                <input
                    type="search"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={actualizarEstado}
                />
            </div>

            {/* Mostrar historial reciente solo cuando no hay búsqueda activa */}
            <div className='recientes'>
                <h2>Busquedas recientes</h2>
                <ul>
                    {recentSearches.map(search => (
                        <li key={search.id} className="recent-item">
                            <span onClick={() => setSearchQuery(search.search)} className="recent-query">
                                {search.search}
                            </span>
                            <button className="block-btn" onClick={async () => {
                                const response = await fetch(`http://localhost:3000/api/wear/history/${search.id}`, {
                                    method: 'DELETE',
                                });
                                const response2 = await fetch(`http://localhost:3000/api/wear/history/${userId}`);
                                if (!response2.ok) throw new Error('Error al buscar prendas');
                                const data = await response2.json();
                                setRecentSearches(data);
                            }}>X</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mostrar resultados de búsqueda */}
            <div className="prendas">
                <h2>Prendas</h2>
                <div className="productos">
                    {searchResults.prendas.map(item => (
                        <Producto
                            key={item.id}
                            idCreator={item.idCreator}
                            idPrenda={item.id}
                            backgroundImageUrl={item.imgPath}
                            precio={item.price}
                            titulo={item.name}
                        />
                    ))}
                </div>
            </div>

            {loading && <LoadingSpinner />}
        </section>
    );
};

// Componente de carga
const LoadingSpinner = () => (
    <div className="loading">
        <div className="dot-wave">
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
            <div className="dot-wave__dot"></div>
        </div>
    </div>
);

export default Search;
