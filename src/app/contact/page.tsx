"use client"
import React from 'react';
import {useState} from 'react';
import Layout from '../layout'
import HEAD from '@/components/header'

interface Task{
  title:string,
  completed:boolean
}
const Contact = () => {
 

  return (
    <>
    <Layout>
      <main>
        <HEAD/>
          <h3>Contact</h3>
      </main>
    </Layout>
    </>
  );
};

export default Contact;