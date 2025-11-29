"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import MenuToggle from './MenuToggle/MenuToggle';
import MenuItem from './MenuItem/MenuItem';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import SectionConfig, { Sections } from '../../config/SectionConfig';

import './Menu.scss';
import { getIcon } from '../icons/Icons';




interface MenuItemType {
  icon: React.ReactNode;
  tooltip: string;
  action: () => void;
  key: string;
}

const Menu: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);

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
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  }


  const menuItems: MenuItemType[] = useMemo(() => {
    const baseItems: Omit<MenuItemType, 'key'>[] = [
      {
        icon: <NightsStayIcon classes={{ root: 'menu-item-icon' }} />,
        tooltip: 'Toggle dark/light theme',
        action: toggleTheme,
      },
    ];


    const sectionItems: Omit<MenuItemType, 'key'>[] = SectionConfig
      .filter(section => !section.notInMenu && section.headerIconKey)
      .map(section => ({
        icon: getIcon(section.headerIconKey, 'menu-item-icon'),
        tooltip: section.name,
        action: () => scrollToSection(section.key),
      }));

    // Add unique keys
    return [...baseItems, ...sectionItems].map((item) => ({
      ...item,
      key: `menu-item-${item.tooltip}`,
    }));
  }, []);

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

  const closeMenu = () => setMenuActive(false);

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
              {...menuItem}
              tooltipPlacement="right"
              menuActive={menuActive}
              isMobile={isMobile}
              rotationAngle={angle}
              key={menuItem.key}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
