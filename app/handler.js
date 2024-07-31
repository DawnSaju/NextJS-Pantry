import { useEffect } from 'react';

const useSidebarToggle = () => {
  useEffect(() => {
    const toggleButton = document.querySelector('[data-drawer-toggle]');
    const sidebar = document.getElementById('logo-sidebar');

    if (toggleButton && sidebar) {
      const toggleSidebar = () => {
        sidebar.classList.toggle('-translate-x-full');
      };

      toggleButton.addEventListener('click', toggleSidebar);

      return () => {
        toggleButton.removeEventListener('click', toggleSidebar);
      };
    }
  }, []);
};

export default useSidebarToggle;
