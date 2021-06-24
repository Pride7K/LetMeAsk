import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext/AuthContext";

export function useAuth()
{
    const value =  useContext(AuthContext)
    return value;
}