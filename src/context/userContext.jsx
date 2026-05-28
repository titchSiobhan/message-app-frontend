import { createContext, useEffect, useState, children } from "react";


export const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    async function authFetch(url, options = {}) {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {})
            }
        })
        if (response.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
            throw new Error('Unauthorized');
        }
        return response;
    }
    useEffect(() => { 
        async function validateToken() {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) return;
            try {
                const response = await authFetch('http://localhost:3000/me');
                const data = await response.json();
                // const {user , token} = data
                
                setUser({...data.user, token: storedToken})
            } catch (error) {
                localStorage.removeItem('token');
                console.log(error)
                setUser(null);
            }
        }
        validateToken();
    }, [])
    return (
    <UserContext.Provider value={{ user, setUser, authFetch }}>
        {children}
    </UserContext.Provider>
)
}

