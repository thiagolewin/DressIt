import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Crea el contexto
const UserContext = createContext();

// Crea un proveedor para el contexto
export const UserProvider = ({ children }) => {
    const [user, setUsuario] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUsuario }}>
            {children}
        </UserContext.Provider>
    );
};

// Validación de las props del componente UserProvider
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto de usuario
export const useUser = () => {
    return useContext(UserContext);
};
