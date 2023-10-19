import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve the token from your preferred storage (localStorage, sessionStorage, etc.)
        const token = localStorage.getItem('token');

        // Set the Authorization header with the token for all Axios requests
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
    )
}

// Custom hook to access user context
export function useUserContext() {
    return useContext(UserContext);
  }