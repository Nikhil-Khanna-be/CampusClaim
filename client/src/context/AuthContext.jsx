import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { data } = await axios.get('/api/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    const login = async (rollNo, password) => {
        try {
            const { data } = await axios.post('/api/auth/login', { rollNo, password });
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (username, rollNo, password, role) => {
        try {
            const { data } = await axios.post('/api/auth/register', { username, rollNo, password, role });
            setUser(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
        } catch(e) {
            console.error(e);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
