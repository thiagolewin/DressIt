import React, { useState } from 'react';
import './FilterModal.css'; // Add appropriate styles

const FilterModal = ({ onClose }) => {
    const [filters, setFilters] = useState({
        gender: [],
        minPrice: '',
        maxPrice: '',
        color: [],
        clothing: [],
    });

    const toggleOption = (type, option) => {
        setFilters(prev => {
            const isSelected = prev[type].includes(option);
            return {
                ...prev,
                [type]: isSelected ? prev[type].filter(o => o !== option) : [...prev[type], option],
            };
        });
    };

    const clearFilters = () => {
        setFilters({
            gender: [],
            minPrice: '',
            maxPrice: '',
            color: [],
            clothing: [],
        });
    };

    return (
        <div className="filter-container">
            <div className="header-row">
                <div className="close-btn" onClick={onClose}>✕</div>
                <div className="filter-by-text"><span>Filtrar por:</span></div>
            </div>
            <button onClick={clearFilters}>Limpiar filtros</button>

            {/* Gender Filter */}
            <div className="filter-section">
                <div className="filter-title" onClick={() => toggleOption('gender', 'male')}>
                    Género
                </div>
                <div className="filter-options">
                    {['Hombre', 'Mujer', 'Niños', 'Niñas'].map(option => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                checked={filters.gender.includes(option)}
                                onChange={() => toggleOption('gender', option)}
                            /> {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="filter-section">
                <div className="filter-title">Precio</div>
                <label>Mínimo: <input type="number" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} /></label>
                <label>Máximo: <input type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} /></label>
            </div>

            {/* Color Filter */}
            <div className="filter-section">
                <div className="filter-title">Color Principal</div>
                <div className="filter-options">
                    {['Rojo', 'Azul', 'Verde', 'Amarillo', 'Negro', 'Blanco'].map(option => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                checked={filters.color.includes(option)}
                                onChange={() => toggleOption('color', option)}
                            /> {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Clothing Filter */}
            <div className="filter-section">
                <div className="filter-title">Prenda</div>
                <div className="filter-options">
                    {['Remeras', 'Buzos', 'Camperas', 'Pantalones', 'Shorts'].map(option => (
                        <label key={option}>
                            <input
                                type="checkbox"
                                checked={filters.clothing.includes(option)}
                                onChange={() => toggleOption('clothing', option)}
                            /> {option}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
