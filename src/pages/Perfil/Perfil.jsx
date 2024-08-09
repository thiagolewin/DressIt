import './Perfil.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import flecha from '../../img/flecha.svg';
import Producto from '../Inicio/Producto.jsx';

const Perfil = () => {
    const { user } = useParams();
    const [userInfo, setUserInfo] = useState(null); // Inicializa como null para manejar mejor los estados
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    const cargarPrendas = async () => {
        if (loading) return;
        setLoading(true);
        
        try {
            let prendasObtenidas = await fetch(`http://localhost:3000/api/users/getuser/2`);
            prendasObtenidas = await prendasObtenidas.json();
            setUserPosts(userPosts => [...userPosts, ...prendasObtenidas]);
            setOffset(offset + 20);  
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                let userResponse = await fetch(`http://localhost:3000/api/users/getuser/2`);
                let userData = await userResponse.json();
                
                if (userData.length === 0) {
                    setUserInfo(undefined); // Si no se encuentra usuario, establece como undefined
                } else {
                    setUserInfo(userData[0]);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        cargarPrendas();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (offset < 82) {
            window.addEventListener('scroll', handleScroll);    
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            cargarPrendas();
        }
    };

    return (
        <section id='Perfil'>
            {userInfo !== undefined && userInfo !== null && (
                <>
                    <img src={userInfo.pfp} alt={`${userInfo.name}'s profile`} className='profilePicture' />
                    <h2>{userInfo.username}</h2>
                    <div className='numberProfile'>
                        <div>
                            <h4>25</h4>
                            <h5>Publicaciones</h5>
                        </div>
                        <div>
                            <h4>25</h4>
                            <h5>Publicaciones</h5>
                        </div>
                        <div>
                            <h4>25</h4>
                            <h5>Publicaciones</h5>
                        </div>
                    </div>
                    <button className='follow'>Seguir</button>
                    <hr />
                    <article className='productos'>
                        {userPosts.map(element => (
                            <Producto idCreator={element.idCreator} id={element.id} key={element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
                        ))}
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
                    </article>
                </>
            )}
            {userInfo === undefined && <p>Perfil no encontrado</p>}
        </section>
    );
};

export default Perfil;
