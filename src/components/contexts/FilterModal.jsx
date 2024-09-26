import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FilterModal.css';

const FilterModal = ({ onClose }) => {
    const [filters, setFilters] = useState({
        gender: [],
        minPrice: '',
        maxPrice: '',
        color: [],
        clothing: [],
    });
    const [errors, setErrors] = useState({});

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
        setErrors({});
    };

    const validateFilters = () => {
        const newErrors = {};
        if (filters.minPrice && filters.maxPrice && parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)) {
            newErrors.price = 'El precio mínimo no puede ser mayor que el precio máximo';
        }
        if (!filters.gender.length && !filters.color.length && !filters.clothing.length) {
            newErrors.filters = 'Debes seleccionar al menos un filtro';
        }
        return newErrors;
    };

    const applyFilters = () => {
        const validationErrors = validateFilters();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            onClose();
        }
    };

    return (
        <div className="filter-container">
            <div className="header-row">
                <div className="close-btn" onClick={onClose}>✕</div>
                <div className="filter-by-text"><span>Filtrar por:</span></div>
            </div>
            <button onClick={clearFilters}>Limpiar filtros</button>
            {errors.filters && <div className="error">{errors.filters}</div>}
            {errors.price && <div className="error">{errors.price}</div>}
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
            <div className="filter-section">
                <div className="filter-title">Precio</div>
                <label>Mínimo: <input type="number" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} /></label>
                <label>Máximo: <input type="number" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} /></label>
            </div>
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
            <button onClick={applyFilters}>Aplicar filtros</button>
        </div>
    );
};

FilterModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default FilterModal;
