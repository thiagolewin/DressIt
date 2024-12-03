import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';
import PropTypes from 'prop-types';

const API_BASE_URL = ' https://76d1-200-73-176-50.ngrok-free.app/api/wear';

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

    const fetchSearchResults = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${searchQuery}/${userId}/6`);
            const data = await response.json();
            setSearchResults({ prendas: data.prendas || [] });
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

            {!searchQuery.trim() && (
                <RecentSearches
                    searches={recentSearches}
                    onBlock={blockSearch}
                    onSelect={(query) => setSearchQuery(query)}
                />
            )}

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

const RecentSearches = ({ searches, onBlock, onSelect }) => (
    <div className="recientes">
        <h2>Búsquedas Recientes</h2>
        <ul>
            {searches.map(search => (
                <li key={search.id} className="recent-item">
                    <span
                        className="recent-query"
                        onClick={() => onSelect(search.search || `Marca ID ${search.idBrand}`)}
                    >
                        {search.search || `Marca ID ${search.idBrand}`}
                    </span>
                    <button className="block-btn" onClick={() => onBlock(search.id)}>X</button>
                </li>
            ))}
        </ul>
    </div>
);

RecentSearches.propTypes = {
    searches: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            search: PropTypes.string,
            idBrand: PropTypes.number,
        })
    ).isRequired,
    onBlock: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

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
