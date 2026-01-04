"use client"
import React from "react";
import { useEffect,useState } from "react";


const useUsers = ()=>{

    const[users,setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('api/utilisateurs');
    
           
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };
    

    useEffect(()=>{
        fetchUsers();
    },[]);

    return {users,useUsers};

};

export default useUsers;