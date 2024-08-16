import './Perfil.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import flecha from '../../img/flecha.svg';
import Producto from '../Inicio/Producto.jsx';
import { useUser } from '../../components/contexts/UserContext.jsx';
const Perfil = () => {
    let {user} = useUser()
    const UserContext = user
    const userParams  = useParams();
    user = {}
    if (UserContext == null) {
        user.username = userParams.user
    }
    else if(UserContext.username == userParams.user) {
        user = UserContext
    } else {
        user.username = userParams.user
    }
    const [userInfo, setUserInfo] = useState(null); // Inicializa como null para manejar mejor los estados
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const cargarPrendas = async () => {
        if (loading) return;
        setLoading(true);
        try {
            console.log(offset)
            let prendasObtenidas = await fetch(`http://localhost:3000/api/wear/brand/` + user.username + "/" + offset +"/" + 20);
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
        setUserPosts([])
        const fetchProfile = async () => {
            try {
                setLoading(true);
                let userResponse = await fetch(`http://localhost:3000/api/users/getuser/` + user.username);
                let userData = await userResponse.json();
                if (userData.username == null|| userData.username == undefined) {
                    setUserInfo(undefined); // Si no se encuentra usuario, establece como undefined
                } else {
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
        cargarPrendas();
        setOffset(offset + 20);  
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [userParams]);

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
            {console.log(userInfo)}
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
                            <Producto idCreator={element.idCreator} id={element.id} key={"profile-"+element.id} backgroundImageUrl={element.imgPath} precio={element.price} titulo={element.name} />
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
