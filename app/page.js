"use client";

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from 'next-auth/react';

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
      <title>Pantry App</title>
      <meta name="description" content="Effortlessly manage your pantry inventory with our NextJS & Firebase powered Pantry App." />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <header className="flex justify-between items-center p-5">
      <div className="text-2xl font-bold">🥫 Pantry App</div>
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
      <section id="home">
          <h1 className="text-6xl font-bold mb-4">Manage Your Pantry with Ease</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Never wonder about your kitchen inventory again. Track, organize, and optimize your pantry effortlessly.
          </p>
          <button onClick={getStarted} className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition">
            Start Organizing
          </button>

          <div className="mt-20 flex justify-center items-center">
            <Image
              src="/thumbnail.jpg"
              alt="Image"
              width={800}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </section>

        <section id="features" class="py-12 sm:py-12 lg:py-32 transition duration-300 ease-in-out">
          <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div class="max-w-xl mx-auto text-center xl:max-w-2xl">
                  <h2 class="text-3xl font-bold leading-tight sm:text-4xl xl:text-5xl mb-6">Exciting Features</h2>
                  <p class="mb-4">Pantry App is a NextJS & Firebase powered web application that helps you manage your kitchen inventory with ease</p>
              </div>
              <div
                  class="grid max-w-4xl lg:max-w-6xl grid-cols-1 mx-auto mt-8 text-center gap-y-4 sm:gap-x-8 sm:grid-cols-2 lg:grid-cols-3 sm:mt-12 lg:mt-20 sm:text-left">
                  <div class="relative">
                      <div class="absolute -inset-1">
                          <div
                              class="w-full h-full rotate-180 opacity-30 blur-lg filter bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                          </div>
                      </div>
                      <div class="relative overflow-hidden bg-green-700 shadow-md rounded-xl h-full">
                          <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24"
                                  fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 8L20 8" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <path d="M4 16L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <ellipse cx="7" cy="8" rx="3" ry="3" transform="rotate(90 7 8)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                                  <ellipse cx="17" cy="16" rx="3" ry="3" transform="rotate(90 17 16)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                              </svg>
                              <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">Google & Github Auth</h3>
                              <p class="mt-6 text-base text-gray-200">NextAuth provides a safe and secure way to protect the user data</p>
                          </div>
                      </div>
                  </div>
                  <div class="overflow-hidden bg-green-700 shadow-md rounded-xl">
                      <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24" fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <rect x="13" y="14" width="2" height="2" rx="1" fill="#fff"></rect>
                              <rect x="7" y="11" width="2" height="6" rx="1" fill="#fff"></rect>
                              <rect x="11" y="13" width="2" height="6" rx="1" transform="rotate(90 11 13)" fill="#fff">
                              </rect>
                              <rect x="16" y="12" width="2" height="2" rx="1" fill="#fff"></rect>
                              <path
                                  d="M14 8V8C14 7.58326 14 7.37488 13.9655 7.19144C13.8455 6.5546 13.4245 6.01534 12.8358 5.74455C12.6662 5.66654 12.464 5.616 12.0597 5.51493L12 5.5C11.5388 5.3847 11.3082 5.32706 11.1171 5.233C10.5686 4.96315 10.1737 4.45731 10.0449 3.85979C10 3.65151 10 3.41382 10 2.93845V2"
                                  stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                              <path
                                  d="M3 14C3 11.4412 3 10.1618 3.61994 9.28042C3.77954 9.05351 3.96572 8.85041 4.17372 8.6763C4.98164 8 6.15442 8 8.5 8H15.5C17.8456 8 19.0184 8 19.8263 8.6763C20.0343 8.85041 20.2205 9.05351 20.3801 9.28042C21 10.1618 21 11.4412 21 14C21 16.5588 21 17.8382 20.3801 18.7196C20.2205 18.9465 20.0343 19.1496 19.8263 19.3237C19.0184 20 17.8456 20 15.5 20H8.5C6.15442 20 4.98164 20 4.17372 19.3237C3.96572 19.1496 3.77954 18.9465 3.61994 18.7196C3 17.8382 3 16.5588 3 14Z"
                                  stroke="#fff" stroke-width="2"></path>
                          </svg>
                          <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">Pantry Classification</h3>
                          <p class="mt-6 text-base text-gray-200">Leveraging Claude vision API to classify pantry items</p> 
                      </div>
                  </div>
                  <div class="relative">
                      <div class="absolute -inset-1">
                          <div
                              class="w-full h-full rotate-180 opacity-30 blur-lg filter bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                          </div>
                      </div>
                      <div class="relative overflow-hidden bg-green-700 shadow-md rounded-xl h-full">
                          <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24"
                                  fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 8L20 8" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <path d="M4 16L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <ellipse cx="7" cy="8" rx="3" ry="3" transform="rotate(90 7 8)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                                  <ellipse cx="17" cy="16" rx="3" ry="3" transform="rotate(90 17 16)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                              </svg>
                              <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">AI Recipe Suggestion</h3>
                              <p class="mt-6 text-base text-gray-200">Get recipe suggestions based on the items in your pantry using GPT</p>
                          </div>
                      </div>
                  </div>
                  <div class="overflow-hidden bg-green-700 shadow-md rounded-xl">
                      <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24" fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <rect x="13" y="14" width="2" height="2" rx="1" fill="#fff"></rect>
                              <rect x="7" y="11" width="2" height="6" rx="1" fill="#fff"></rect>
                              <rect x="11" y="13" width="2" height="6" rx="1" transform="rotate(90 11 13)" fill="#fff">
                              </rect>
                              <rect x="16" y="12" width="2" height="2" rx="1" fill="#fff"></rect>
                              <path
                                  d="M14 8V8C14 7.58326 14 7.37488 13.9655 7.19144C13.8455 6.5546 13.4245 6.01534 12.8358 5.74455C12.6662 5.66654 12.464 5.616 12.0597 5.51493L12 5.5C11.5388 5.3847 11.3082 5.32706 11.1171 5.233C10.5686 4.96315 10.1737 4.45731 10.0449 3.85979C10 3.65151 10 3.41382 10 2.93845V2"
                                  stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                              <path
                                  d="M3 14C3 11.4412 3 10.1618 3.61994 9.28042C3.77954 9.05351 3.96572 8.85041 4.17372 8.6763C4.98164 8 6.15442 8 8.5 8H15.5C17.8456 8 19.0184 8 19.8263 8.6763C20.0343 8.85041 20.2205 9.05351 20.3801 9.28042C21 10.1618 21 11.4412 21 14C21 16.5588 21 17.8382 20.3801 18.7196C20.2205 18.9465 20.0343 19.1496 19.8263 19.3237C19.0184 20 17.8456 20 15.5 20H8.5C6.15442 20 4.98164 20 4.17372 19.3237C3.96572 19.1496 3.77954 18.9465 3.61994 18.7196C3 17.8382 3 16.5588 3 14Z"
                                  stroke="#fff" stroke-width="2"></path>
                          </svg>
                          <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">Firebase Cloud Firestore</h3>
                          <p class="mt-6 text-base text-gray-200">Store your pantry data in a secure and scalable database</p>
                      </div>
                  </div>
                  <div class="relative">
                      <div class="absolute -inset-1">
                          <div
                              class="w-full h-full rotate-180 opacity-30 blur-lg filter bg-gradient-to-r from-green-400 via-green-500 to-green-600">
                          </div>
                      </div>
                      <div class="relative overflow-hidden bg-green-700 shadow-md rounded-xl h-full">
                          <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24"
                                  fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11 8L20 8" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <path d="M4 16L14 16" stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                                  <ellipse cx="7" cy="8" rx="3" ry="3" transform="rotate(90 7 8)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                                  <ellipse cx="17" cy="16" rx="3" ry="3" transform="rotate(90 17 16)" stroke="#fff"
                                      stroke-width="2" stroke-linecap="round"></ellipse>
                              </svg>
                              <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">Clean User Interface</h3>
                              <p class="mt-6 text-base text-gray-200">Simple and intuitive design to make your pantry management a breeze</p>
                          </div>
                      </div>
                  </div>
                  <div class="overflow-hidden bg-green-700 shadow-md rounded-xl">
                      <div class="p-9"><svg class="w-12 h-12 mx-auto text-gray-400 sm:mx-0" viewBox="0 0 24 24" fill="none"
                              xmlns="http://www.w3.org/2000/svg">
                              <rect x="13" y="14" width="2" height="2" rx="1" fill="#fff"></rect>
                              <rect x="7" y="11" width="2" height="6" rx="1" fill="#fff"></rect>
                              <rect x="11" y="13" width="2" height="6" rx="1" transform="rotate(90 11 13)" fill="#fff">
                              </rect>
                              <rect x="16" y="12" width="2" height="2" rx="1" fill="#fff"></rect>
                              <path
                                  d="M14 8V8C14 7.58326 14 7.37488 13.9655 7.19144C13.8455 6.5546 13.4245 6.01534 12.8358 5.74455C12.6662 5.66654 12.464 5.616 12.0597 5.51493L12 5.5C11.5388 5.3847 11.3082 5.32706 11.1171 5.233C10.5686 4.96315 10.1737 4.45731 10.0449 3.85979C10 3.65151 10 3.41382 10 2.93845V2"
                                  stroke="#fff" stroke-width="2" stroke-linecap="round"></path>
                              <path
                                  d="M3 14C3 11.4412 3 10.1618 3.61994 9.28042C3.77954 9.05351 3.96572 8.85041 4.17372 8.6763C4.98164 8 6.15442 8 8.5 8H15.5C17.8456 8 19.0184 8 19.8263 8.6763C20.0343 8.85041 20.2205 9.05351 20.3801 9.28042C21 10.1618 21 11.4412 21 14C21 16.5588 21 17.8382 20.3801 18.7196C20.2205 18.9465 20.0343 19.1496 19.8263 19.3237C19.0184 20 17.8456 20 15.5 20H8.5C6.15442 20 4.98164 20 4.17372 19.3237C3.96572 19.1496 3.77954 18.9465 3.61994 18.7196C3 17.8382 3 16.5588 3 14Z"
                                  stroke="#fff" stroke-width="2"></path>
                          </svg>
                          <h3 class="mt-6 text-2xl font-bold text-white sm:mt-10">Ease of Access</h3>
                          <p class="mt-6 text-base text-gray-200">Access your pantry from anywhere, anytime using any device</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </main>
                                      
    <footer className="text-center p-8 bg-green-800 text-white">
      <p>Made with ❤️ by Dawn Saju</p>
      <p>As part of Headstarter SWE Fellowship</p>
    </footer>
  </div>
  );
};

export default LandingPage;
