import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useSession() {
    const [session, setSession] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const stored = localStorage.getItem("userSession");
        if (stored) setSession(JSON.parse(stored));
    }, []);

    const saveSession = (data: any) => {
        localStorage.setItem("userSession", JSON.stringify(data));
        setSession(data);
    };

    const updateSession = (updates: any) => {
        const current = JSON.parse(localStorage.getItem("userSession") || "");
        const newSession = { ...current, ...updates };
        localStorage.setItem("userSession", JSON.stringify(newSession));
        setSession(newSession);
    }

    const clearSession = () => {
        localStorage.removeItem("userSession");
        setSession(null);
    };

    const checkSession = (requiredField: string[]) => {
        try {
            const current = localStorage.getItem("userSession");
            if (!current) return false;
            const session = JSON.parse(current);
            return requiredField.every(field => session[field]);
        }
        catch (error) {
            return false;
        }
    }

    return { session, saveSession, clearSession, updateSession, checkSession };
}
