import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        axios.get('/v1/auth/profile').then(res => {
            setId(res.data.id);
            setUsername(res.data.username);
        })
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    return (
        <UserContext.Provider value={{username, setUsername, id, setId}}>{children}</UserContext.Provider>
    )
}