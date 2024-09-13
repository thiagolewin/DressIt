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

    const userId = user ? user.id : 2; // Usa el id del usuario o un valor por defecto (2)

    const Buscar = async (event) => {
        const newValue = event.target.value;
        setValue(newValue); 
        setOffset(9); 
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/wear/search/${newValue}/${userId}/9`); // Buscar las primeras 9 prendas
            const data = await response.json();
            
            console.log("Respuesta de la búsqueda:", data);
            if (data && data.prendas && data.marcas) {
                setBusqueda({ prendas: data.prendas, marcas: data.marcas });
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
            console.log(`Cargando más prendas con offset: ${offset}`);
            const response = await fetch(`http://localhost:3000/api/wear/search/${value}/${offset}/6`); // Cargar 6 más
            const data = await response.json();

            console.log('Datos recibidos:', data);

            if (data && Array.isArray(data.prendas)) {
                console.log('Prendas actuales en estado:', busqueda.prendas); 
                console.log('Nuevas prendas recibidas:', data.prendas);

                const nuevasPrendas = data.prendas.filter(prenda => 
                    !busqueda.prendas.some(existingPrenda => existingPrenda.id === prenda.id)
                );

                console.log('Nuevas prendas después del filtro:', nuevasPrendas);

                if (nuevasPrendas.length > 0) {
                    setBusqueda(prev => ({
                        ...prev,
                        prendas: [...prev.prendas, ...nuevasPrendas]
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
                        <div key={index} className='marca'>
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
