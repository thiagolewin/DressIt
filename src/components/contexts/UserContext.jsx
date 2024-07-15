import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const UserContext = createContext();

// Crea un proveedor para el contexto
export const UserProvider = ({ children }) => {
    const [user, setUsusario] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUsusario }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto de usuario
export const useUser = () => {
    return useContext(UserContext);
};
