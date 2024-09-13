import './Search.css';
import { useState, useEffect } from 'react';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';

const Search = () => {
    const [busqueda, setBusqueda] = useState({ prendas: [], marcas: [] });
    const [offset, setOffset] = useState(0); 
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState(''); 
    const { user } = useUser();  
    const userId = user ? user.id : 2;

    const Buscar = async (event) => {
        const newValue = event.target.value;
        setValue(newValue); 
        console.log(newValue,userId)
        setOffset(9); 
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/wear/search/${newValue}/${userId}/6`); 
            const data = await response.json();
            
            console.log("Respuesta de la búsqueda:", data);
            if (data && data.prendas && data.marcas) {
                setBusqueda({ prendas: data.prendas, marcas: data.marcas });
                console.log("Estado actualizado:", { prendas: data.prendas, marcas: data.marcas });
            } else {
                console.error('Error: Datos recibidos no tienen el formato esperado.');
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
        } finally {
            setLoading(false);
        }
    };

    const cargarMasPrendas = async () => {
        if (loading || !value) return; 
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/wear/${value}/${offset}/4`);
            const data = await response.json();
            console.log(data)
            if (data && Array.isArray(data)) {
                const filteredNewArray = data.filter(newItem =>
                    !busqueda.prendas.some(originalItem => originalItem.id === newItem.id)
                  );
                console.log(filteredNewArray)

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

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
            cargarMasPrendas(); 
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset, value, loading]);

    return (
        <section id="Search">
            <div className='searchBar'>
                <input 
                    type="search" 
                    placeholder='Buscar' 
                    onInput={Buscar} 
                />
                <h4>Cancelar</h4>
            </div>
            
            <div className='marcas'>
                <h2>Marcas</h2>
                <div className="marcaContainer">
                    {busqueda.marcas.slice(0, 5).map((marca, index) => (
                        <div key={marca.id || index} className='marca'>
                            <h4>{marca.nombre}</h4>
                        </div>
                    ))}
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
