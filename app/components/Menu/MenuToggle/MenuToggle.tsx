import React, { ReactNode } from 'react';
import CircleButton from '../../CircleButton/CircleButton';
import './MenuToggle.scss';

interface MenuToggleProps {
  toggleMenu: () => void;
  isMobile?: boolean;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ toggleMenu }) => (
  <CircleButton onClick={toggleMenu} size={4} className="menu-toggle" isAnimated={false} aria-label="Menu Toggle">
    <div className="menu-burger">
      <span className="menu-burger-bar"></span>
      <span className="menu-burger-bar"></span>
      <span className="menu-burger-bar"></span>
    </div>
  </CircleButton>
);

export default MenuToggle;