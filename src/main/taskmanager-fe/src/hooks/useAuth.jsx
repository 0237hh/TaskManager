import {useContext, useEffect, useState} from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {instance} from "../config/axiosConfig.jsx";

const useAuth = () => {
    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const parsedToken = JSON.parse(token);
                instance.defaults.headers.common["Authorization"] = `Bearer ${parsedToken}`;
            } catch (error) { }
        } else { }
    }, []);
    return { user, setUser };
};

export default useAuth;