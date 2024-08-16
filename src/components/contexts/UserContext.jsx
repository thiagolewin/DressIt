import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto
const UserContext = createContext();

// Crea un proveedor para el contexto
export const UserProvider = ({ children }) => {
    // Inicializa el estado con el valor del localStorage si está disponible
    const [user, setUsuario] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Guarda el estado en localStorage cada vez que cambia
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto de usuario
export const useUser = () => {
    return useContext(UserContext);
};
