import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import useSidebarToggle from './handler';

export default function Sidebar() {
   useSidebarToggle();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
   if (status === "authenticated") {
     // console.log(session.user);
     setUser(session.user);
   } else if (status === "unauthenticated") {
     signIn();
   }
 }, [status, session]);

  return (
    <>

<nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
  <div className="px-3 py-3 lg:px-5 lg:pl-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center justify-start rtl:justify-end">
        <button id="sidebar_toggle" data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 :text-gray-400">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
        <a href="/" className="flex ms-2 md:me-24">
          <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap">Pantry App</span>
        </a>
      </div>
      <div className="flex items-center">
          <div className="flex items-center ms-3">
            <div>
              <div className="flex flex-row ms-2 text-center justify-center items-center gap-4">
               {user ? (
                  <>
                     <img
                     className="w-8 h-8 rounded-full"
                     alt="profile"
                     src={user.image ? `${user.image}` : `${user.picture}`}
                     />
                     <p className="text-md text-gray-900" role="none">
                     {user.name}
                     </p>
                  </>
               ) : (
                  <>
                     <img
                     className="w-8 h-8 rounded-full"
                     src="https://avatar.iran.liara.run/username?username=Unknown"
                     alt="profile"
                     />
                     <p className="text-md text-gray-900" role="none">
                     Loading...
                     </p>
                  </>
               )}
               </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

<aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0" aria-label="Sidebar">
   <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
      <ul className="space-y-2 font-medium">
         <li>
            <a href="/" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
               </svg>
               <span className="ms-3">Home</span>
            </a>
         </li>
         <li>
            <a href="/pantry" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900"  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M243.1 2.7c11.8 6.1 16.3 20.6 10.2 32.4L171.7 192l232.6 0L322.7 35.1c-6.1-11.8-1.5-26.3 10.2-32.4s26.2-1.5 32.4 10.2L458.4 192l36.1 0 49.5 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-20 0L476.1 463.5C469 492 443.4 512 414 512L162 512c-29.4 0-55-20-62.1-48.5L44 240l-20 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l8 0 49.5 0 36.1 0L210.7 12.9c6.1-11.8 20.6-16.3 32.4-10.2zM93.5 240l53 211.9c1.8 7.1 8.2 12.1 15.5 12.1L414 464c7.3 0 13.7-5 15.5-12.1l53-211.9-389 0zM224 312l0 80c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24s24 10.7 24 24zm64-24c13.3 0 24 10.7 24 24l0 80c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24zm112 24l0 80c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-80c0-13.3 10.7-24 24-24s24 10.7 24 24z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Pantry</span>
            </a>
         </li>
         <li>
            <a href="/recent" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Recent Uploads</span>
            </a>
         </li>
         <li>
            <a href="/api/auth/signout" className="flex items-center p-2 text-gray-900 rounded-lg group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap text-gray-600 hover:text-red-500 font-bold">Signout</span>
            </a>
         </li>
      </ul>
   </div>
</aside>
</>
  );
}
