import './Search.css';
import { useState, useEffect, useCallback } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';

const API_BASE_URL = 'http://localhost:3000/api/wear';

const Search = () => {
    const [searchResults, setSearchResults] = useState({ prendas: [] });
    const [recentSearches, setRecentSearches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useUser();
    const userId = user?.id || 3;

    // Obtener historial reciente al cargar el componente
    useEffect(() => {
        if (userId) fetchRecentSearches();
    }, [userId]);

    // Obtener historial reciente desde el backend
    const fetchRecentSearches = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/${userId}`);
            if (!response.ok) throw new Error('Error al obtener búsquedas recientes');
            const data = await response.json();
            setRecentSearches(data);
        } catch (error) {
            console.error('Error al obtener historial:', error);
        }
    };

    // Actualizar historial cuando el usuario busca algo nuevo
    const addSearchToHistory = useCallback(async (search) => {
        try {
            await fetch(`${API_BASE_URL}/history/add/${search}/${userId}`, {
                method: 'POST',
            });
            // Refrescar el historial después de agregar
            await fetchRecentSearches();
        } catch (error) {
            console.error('Error al agregar búsqueda al historial:', error);
        }
    }, [userId]);

    // Eliminar un ítem del historial
    const deleteSearchFromHistory = async (searchId) => {
        try {
            await fetch(`${API_BASE_URL}/history/${searchId}`, {
                method: 'DELETE',
            });
            // Refrescar el historial después de eliminar
            await fetchRecentSearches();
        } catch (error) {
            console.error('Error al eliminar búsqueda:', error);
        }
    };

    // Buscar resultados de prendas
    const fetchSearchResults = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${searchQuery}/${userId}/6`);
            if (!response.ok) throw new Error('Error al buscar prendas');
            const data = await response.json();
            setSearchResults({ prendas: data.prendas || [] });
        } catch (error) {
            console.error('Error al buscar prendas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Escuchar cambios en el campo de búsqueda
    useEffect(() => {
        if (searchQuery.trim()) {
            fetchSearchResults();
            addSearchToHistory(searchQuery); // Guardar búsqueda en el historial
        }
    }, [searchQuery, addSearchToHistory]);

    return (
        <section id="Search">
            <div className="searchBar">
                <input
                    type="search"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Mostrar historial reciente */}
            {!searchQuery.trim() && (
                <div className="recientes">
                    <h2>Busquedas recientes</h2>
                    <ul>
                        {recentSearches.map(search => (
                            <li key={search.id} className="recent-item">
                                <span
                                    onClick={() => setSearchQuery(search.search)}
                                    className="recent-query"
                                >
                                    {search.search}
                                </span>
                                <button
                                    className="block-btn"
                                    onClick={() => deleteSearchFromHistory(search.id)}
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Mostrar resultados de búsqueda */}
            <div className="prendas">
                <h2>Prendas</h2>
                <div className="productos">
                    {searchResults.prendas.map(item => (
                        <Producto
                            key={item.id}
                            idCreator={item.idCreator}
                            id={item.id}
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
