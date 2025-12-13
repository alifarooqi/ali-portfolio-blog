"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import MenuToggle from './MenuToggle/MenuToggle';
import MenuItem, { MenuItemType } from './MenuItem/MenuItem';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SectionConfig, { Sections } from '../../config/SectionConfig';
import { getIcon } from '../icons/Icons';
import './Menu.scss';

const Menu: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const pathname = usePathname();

  const closeMenu = () => setMenuActive(false);

  const scrollToSection = useCallback(
    (sectionName: Sections) => {
      const element = document.getElementById(sectionName);
      
      if(element){
        const offset = window.innerHeight > element.offsetHeight 
          ? (window.innerHeight - element.offsetHeight)/2 
          : 0;
        window.scrollTo({
          top: element.offsetTop - offset,
          left: 0,
          behavior: 'smooth',
        });
      }
      closeMenu();
    },
    []
  );

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  }

  const menuItems: MenuItemType[] = useMemo(() => {
    const baseItems: MenuItemType[] = [
      {
        icon: <NightsStayIcon classes={{ root: 'menu-item-icon' }} />,
        tooltip: 'Toggle dark/light theme',
        action: toggleTheme,
        key: 'menu-theme-toggle',
      },
    ];


    const sectionItems: MenuItemType[] = SectionConfig
      .filter(section => !section.notInMenu && section.headerIconKey)
      .map(section => ({
        icon: getIcon(section.headerIconKey, 'menu-item-icon'),
        tooltip: section.name,
        action: () => scrollToSection(section.key),
        key: `menu-section-${section.key}`,
      }));

    const pageItems: MenuItemType[] = [
      {
        icon: getIcon('home', 'menu-item-icon'),
        tooltip: 'Home',
        link: '/',
        key: 'menu-page-home',
      },
      {
        icon: getIcon('blog', 'menu-item-icon'),
        tooltip: 'Blog',
        link: '/blog',
        key: 'menu-page-blog',
      },
    ];


    // Add unique keys
    if(pathname === '/'){
      return [...baseItems, ...pageItems, ...sectionItems]
    } else {
      return [...baseItems, ...pageItems]
    }
  }, [pathname]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    checkMobile();

    // Update on resize (optional)
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startAngle = isMobile ? 0 : -90;
  const rotationAngle = isMobile ? 90 : 180;


  return (
    <div className={menuActive ? 'menu menu-active' : 'menu'}>
      <div className="menu-backdrop" onClick={closeMenu}></div>
      <div className="menu-data">
        <MenuToggle isMobile={isMobile} toggleMenu={() => setMenuActive(m => !m)} />

        {menuItems.map((menuItem, index) => {
          let angle = startAngle;
          let increment = 0;
          if (menuItems.length > 1) {
            increment = Math.round(rotationAngle / (menuItems.length - 1));
          }
          angle += index * increment;

          return (
            <MenuItem
              key={menuItem.key}
              menuItem={menuItem}
              menuActive={menuActive}
              isMobile={isMobile}
              rotationAngle={angle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
