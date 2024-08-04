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
               <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>
               <span className="ms-3">Home</span>
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
