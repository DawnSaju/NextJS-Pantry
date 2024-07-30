"use client";

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from 'next-auth/react';
import './globals.css';

const LandingPage = () => {
    
  const router = useRouter();
  const { data: session, status } = useSession();

  const getStarted = () => {
    console.log('Get Started');
    router.push('/pantry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200">
    <Head>
      <title>Pantry App - Manage Your Kitchen Inventory</title>
      <meta name="description" content="Effortlessly manage your pantry inventory with our NextJS & Firebase powered Pantry App." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <header className="flex justify-between items-center p-5">
      <div className="text-2xl font-bold">🥫 Pantry App</div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#features" className="hover:underline">Features</a></li>
          <li><a href="#about" className="hover:underline">About</a></li>
          <li><a href="#contact" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
      <div>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : session ? (
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
        >
          Sign In
        </button>
      )}
    </div>

    </header>

    <main className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold mb-4">Manage Your Pantry with Ease</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Never wonder about your kitchen inventory again. Track, organize, and optimize your pantry effortlessly.
      </p>
      <button onClick={getStarted} className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition">
        Start Organizing
      </button>

      <div className="mt-20 flex justify-center items-center">
        <Image
          src="/pantry-app-screenshot.png"
          alt="Pantry App Screenshot"
          width={800}
          height={400}
          className="rounded-lg shadow-xl"
        />
      </div>
    </main>

    <footer className="text-center p-8 bg-green-800 text-white">
      <p>Made with ❤️ by Dawn Saju</p>
      <p>As part of Headstarter SWE Fellowship</p>
      <p>Powered by NextJS & Firebase</p>
    </footer>
  </div>
  );
};

export default LandingPage;
