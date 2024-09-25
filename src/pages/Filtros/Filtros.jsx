import './Filtros.css';
import { useState } from 'react';

const Filtros = () => {
    const [filtros, setFiltros] = useState({});

    const alternarSeccion = (sectionId) => {
        const section = document.getElementById(sectionId);
        const arrow = document.getElementById(sectionId.replace('section', 'arrow'));
        if (section.style.display === 'none') {
            section.style.display = 'block';
            arrow.style.transform = 'rotate(180deg)';
        } else {
            section.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
    };

    const limpiarFiltros = () => {
        const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        
        setFiltros({});
    };

    const agregarFiltro = (opcion, valor) => {
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [opcion]: valor
        }));
    };

    return (
        <div className="filter-container">
            <div className="header-row">
                <div className="close-btn">✕</div>
                <div className="filter-by-text">
                    <span>Filtrar por:</span>
                </div>
            </div>
            <a href="#" className="clear-filters" onClick={limpiarFiltros}>Limpiar filtros</a>
            <div className="filter-section">
                <div className="filter-title" onClick={() => alternarSeccion('gender-section')}>Género
                    <span className="arrow" id="gender-arrow">▼</span>
                </div>
                <div id="gender-section" className="filter-options" style={{display: 'none'}}>
                    <label><input type="checkbox"/> Hombre</label>
                    <label><input type="checkbox"/> Mujer</label>
                    <label><input type="checkbox"/> Niños</label>
                    <label><input type="checkbox"/> Niñas</label>
                </div>
            </div>
            <div className="filter-section">
                <div className="filter-title" onClick={() => alternarSeccion('price-section')}>Precio
                    <span className="arrow" id="price-arrow">▼</span>
                </div>
                <div id="price-section" className="filter-options" style={{display: 'none'}}>
                    <label>Mínimo: <input type="number" id="min-price" placeholder="$10000"/></label>
                    <label>Máximo: <input type="number" id="max-price" placeholder="$28000"/></label>
                </div>
            </div>
            <div className="filter-section">
                <div className="filter-title" onClick={() => alternarSeccion('color-section')}>Color Principal
                    <span className="arrow" id="color-arrow">▼</span>
                </div>
                <div id="color-section" className="filter-options" style={{display: 'none'}}>
                    <label><input type="checkbox"/> Rojo</label>
                    <label><input type="checkbox"/> Azul</label>
                    <label><input type="checkbox"/> Verde</label>
                    <label><input type="checkbox"/> Amarillo</label>
                    <label><input type="checkbox"/> Negro</label>
                    <label><input type="checkbox"/> Blanco</label>
                    <label><input type="checkbox"/> Rosa</label>
                    <label><input type="checkbox"/> Violeta</label>
                    <label><input type="checkbox"/> Marrón</label>
                </div>
            </div>
        </div>
    );
};

export default Filtros;
