"use client"
import { Suspense, useState, useEffect } from "react";

interface Post {
  id: string
  title: string
  body: string
}

export default function BlogStatiqueGeneration() {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(data => setPosts(data))
    }, [])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <h1>Blog Statique Generation</h1>
        {posts.map((post) => (
          <div key={post.id} className="post bg-gray-100 p-4 rounded-md">
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-gray-700">{post.body}</p>
          </div>
        ))}
      </div>
    </Suspense>
  );
}