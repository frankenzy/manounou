import React from "react";
import { Suspense } from "react";
import Loyout from "../layout";
import Header from "../../components/header";
import Image from "next/image";

interface Post {
  id: string
  title: string
  body: string
}

export const revalidate = 10
 
export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://jsonplaceholder.typicode.com/posts').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}
 


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  const posts:Post[] = await fetch(`https://jsonplaceholder.typicode.com/posts`).then(

    (res) => res.json()
  )

  const firstThreePosts = posts.slice(0,3);

  const restPosts = posts.slice(3,posts.length)

  return (
    <Loyout>
      <Header />
      <main>

        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[url('/04.jpg')] bg-cover bg-center bg-fixed bg-no-repeat relative">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h1 className="text-white text-8xl font-bold opacity-100 z-index-10 relative">Bienvenue sur la page des  blogs</h1>
        </div>


          <div className="w-full bg-white">
          <div className="container mx-auto px-4 py-8 flex flex-col justify-center">

           <div className="flex flex-col py-4 justify-center items-center">
           <h3 className="text-red-800 uppercase text-4xl">Les posts recents</h3>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            {firstThreePosts.map((post) => (
              <div key={post.id} className="bg-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-3 hover:scale-105 hover:bg-gray-300 transition-all duration-300 ease-in-out">
               
                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

                  <p className="text-gray-600">{post.body}</p>

                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
        <div className="grid grid-cols-3 w-full">
            <div className="col-span-2 bg-[url('/04.jpg')] bg-cover bg-center bg-no-repeat relative">
                <div className="w-full h-screen">
                  <div className="absolute inset-0 bg-black opacity-50"> </div>
                </div>
            </div>
            <div className="flex items-center justify-center bg-white">
                <h3 className="text-3xl font-bold text-center">
                    Toute l'actualité des technologies et de l'information
                </h3>
            </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
            {
              restPosts.map((post)=>(
                <div key={post.id} className="bg-gray-200 shadow-lg rounded-lg overflow-hidden ease-in-out">
               
                <div className="p-6">

                  <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

                  <p className="text-gray-600">{post.body}</p>

                </div>
              </div>
              ))
            }
        </div>

      </main>
    </Loyout>
  )
}
