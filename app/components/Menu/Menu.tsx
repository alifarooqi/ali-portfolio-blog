"use client";

import React, { useState, useMemo, useEffect } from "react";
import MenuToggle from "./MenuToggle/MenuToggle";
import MenuItem, { MenuItemType } from "./MenuItem/MenuItem";
import ThemeToggleIcon from "./ThemeToggleIcon";
import SoundToggleIcon from "./SoundToggleIcon";
import { useIsDarkMode } from "./useIsDarkMode";
import { useIsMuted } from "./useIsMuted";
import { toggleSound } from "@/lib/sound";
import { getIcon } from "../icons/Icons";
import "./Menu.scss";

// Fixed global set: the radial menu renders the same four items in the same
// order on every route. Section-scroll shortcuts have moved to the home-only
// <SectionNav /> component (see app/page.tsx). Keep this list route-agnostic
// so the arc geometry stays constant across pages.
const Menu: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const isDark = useIsDarkMode();
  const isMuted = useIsMuted();

  const closeMenu = () => setMenuActive(false);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    // useIsDarkMode picks up the class change via its MutationObserver.
  };

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        icon: getIcon("home", "menu-item-icon"),
        tooltip: "Home",
        link: "/",
        key: "menu-page-home",
      },
      {
        icon: getIcon("blog", "menu-item-icon"),
        tooltip: "Blog",
        link: "/blog",
        key: "menu-page-blog",
      },
      {
        icon: <ThemeToggleIcon isDark={isDark} />,
        tooltip: "Toggle dark/light theme",
        action: toggleTheme,
        key: "menu-theme-toggle",
      },
      {
        icon: <SoundToggleIcon isMuted={isMuted} />,
        tooltip: "Toggle sound effects",
        action: toggleSound,
        key: "menu-sound-toggle",
      },
    ],
    [isDark, isMuted],
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    checkMobile();

    // Update on resize (optional)
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const startAngle = isMobile ? 0 : -90;
  const rotationAngle = isMobile ? 90 : 180;

  return (
    <div className={menuActive ? "menu menu-active" : "menu"}>
      <div className="menu-backdrop" onClick={closeMenu}></div>
      <div className="menu-data" id="menu-data">
        <MenuToggle isMobile={isMobile} toggleMenu={() => setMenuActive((m) => !m)} isOpen={menuActive} />

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
