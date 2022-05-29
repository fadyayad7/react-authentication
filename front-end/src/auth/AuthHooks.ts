import { useEffect, useState } from "react"
import jwt from 'jwt-decode' // import dependency

export const useToken = () => {
    const [token, setTokenInternal] = useState(() => {
        return localStorage.getItem("token")
    });

    const setToken = (newToken: string): void => {
        localStorage.setItem("token", newToken);
        setTokenInternal(newToken);
    }

    return [token, setToken];
}

export const useUser = () => {
    const [token] = useToken();

    const [user, setUser] = useState(() => {
        if(!token) return null;
        return jwt(token?.toString());
    });

    useEffect(() => setUser(token ? jwt(token.toString()) : null), [token]);

    return user;
}