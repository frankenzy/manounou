import React from "react";

interface Blogs {
    id: number
    title: string
    body: string
}

export const revalidate = 60;

export const dynamic = 'force-dynamic';

export const dynamicParams = true;

export async function BlogIncrementPage() {

    const blogs = await fetch('https://jsonplaceholder.typicode.com/posts').then((res) => res.json())

    return blogs.map((blog: Blogs) => ({

        id: String(blog.id),

        title: blog.title,

        body: blog.body,
        
    }))

}

export default async function Page() {

    const blogs = await BlogIncrementPage()

    return <div>

        <h1>Blog Increment Page</h1>

        {blogs.map((blog: Blogs) => 

        <div className="flex flex-col gap-4">

            <div key={blog.id} className="text-2xl font-bold">{blog.title}</div>

            <div>{blog.body}</div>

        </div>

        )

        }

    </div>
}

