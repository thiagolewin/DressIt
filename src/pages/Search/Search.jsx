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
    const { user } = useUser();
    const userId = user?.id || 3;

    useEffect(() => {
        if (userId) fetchRecentSearches();
    }, [userId]);

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

    // Bloquear (ocultar) una búsqueda del historial
    const blockSearch = async (searchId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/block/${searchId}`, { method: 'PUT' });
            if (response.ok) {
                setRecentSearches(prev => prev.filter(search => search.id !== searchId));
            } else {
                console.error('Error al bloquear la búsqueda.');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Agregar una búsqueda al historial
    const addSearchToHistory = async (searchTerm) => {
        try {
            const response = await fetch(`${API_BASE_URL}/history/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUser: userId, searchTerm }),
            });
            if (!response.ok) throw new Error('Error al agregar búsqueda al historial');
        } catch (error) {
            console.error('Error al agregar búsqueda al historial:', error);
        }
    };

    // Buscar resultados de prendas
    const fetchSearchResults = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${searchQuery}/${userId}/6`);
            const data = await response.json();
            setSearchResults({ prendas: data.prendas || [] });

            // Agregar búsqueda válida al historial
            if (data.prendas && data.prendas.length > 0) {
                await addSearchToHistory(searchQuery);
            }
        } catch (error) {
            console.error('Error al buscar prendas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim()) fetchSearchResults();
    }, [searchQuery]);

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

            {/* Mostrar historial reciente solo cuando no hay búsqueda activa */}
            {!searchQuery.trim() && (
                <RecentSearches
                    searches={recentSearches}
                    onBlock={blockSearch}
                    onSelect={(query) => setSearchQuery(query)}
                />
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

// Historial reciente
const RecentSearches = ({ searches, onBlock, onSelect }) => (
    <div className="recientes">
        <h2>Búsquedas Recientes</h2>
        <ul>
            {searches.map(search => (
                <li key={search.id} className="recent-item">
                    <span
                        className="recent-query"
                        onClick={() => onSelect(search.search)}
                    >
                        {search.search}
                    </span>
                    <button className="block-btn" onClick={() => onBlock(search.id)}>X</button>
                </li>
            ))}
        </ul>
    </div>
);

// Validaciones de propiedades del componente RecentSearches
RecentSearches.propTypes = {
    searches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            search: PropTypes.string.isRequired,
        })
    ).isRequired,
    onBlock: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
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
