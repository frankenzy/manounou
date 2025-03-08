"use client";
import React from "react";
import Layout from '../layout'
import Header from "@/components/header";
import useUsers from "@/hooks/useUsers";
import Card from "@/components/card";

const partner = () => {

    interface Users {
        id: number
        nom: string
        email: string
    }[];

    const { users } = useUsers();
    return (
        <>
            <Layout>
                <Header />
                <main>
                    <div className="flex flex-row justify-center items-center gap-2 w-full">


                        {users.map((user: Users) => (
                            
                            <div key={user.id} className="flex flex-cols">

                       
                                    <Card>

                                        {user.nom}

                                    </Card>
                               
                            </div>
                        ))}
                    </div>
                </main>

            </Layout>
        </>
    )
}

export default partner