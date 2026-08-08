"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import MenuToggle from "./MenuToggle/MenuToggle";
import MenuItem, { MenuItemType } from "./MenuItem/MenuItem";
import ThemeToggleIcon from "./ThemeToggleIcon";
import SoundToggleIcon from "./SoundToggleIcon";
import { useIsDarkMode } from "./useIsDarkMode";
import { useIsMuted } from "./useIsMuted";
import { setMuted, playSound, isMuted as readIsMuted } from "@/lib/sound";
import SectionConfig, { Sections } from "../../config/SectionConfig";
import { getIcon } from "../icons/Icons";
import "./Menu.scss";

const Menu: React.FC = () => {
  const [menuActive, setMenuActive] = useState<boolean>(false);
  const isDark = useIsDarkMode();
  const isMuted = useIsMuted();
  const pathname = usePathname();

  const closeMenu = () => setMenuActive(false);

  const scrollToSection = useCallback((sectionName: Sections) => {
    const element = document.getElementById(sectionName);

    if (element) {
      const offset =
        window.innerHeight > element.offsetHeight
          ? (window.innerHeight - element.offsetHeight) / 2
          : 0;
      window.scrollTo({
        top: element.offsetTop - offset,
        left: 0,
        behavior: "smooth",
      });
    }
    closeMenu();
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    // useIsDarkMode picks up the class change via its MutationObserver.
  };

  const toggleSound = () => {
    // Read mute state imperatively from the DOM (mirrors toggleTheme) so this
    // function doesn't capture the reactive isMuted value and pollute the
    // menuItems useMemo deps. useIsMuted still drives SoundToggleIcon's render.
    const next = !readIsMuted();
    setMuted(next);
    // Confirmation beep only on unmute — when muting, no sound should play.
    if (!next) playSound("toggle");
  };

  const menuItems: MenuItemType[] = useMemo(() => {
    const baseItems: MenuItemType[] = [
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
    ];

    const sectionItems: MenuItemType[] = SectionConfig.filter(
      (section) => !section.notInMenu && section.headerIconKey
    ).map((section) => ({
      icon: getIcon(section.headerIconKey, "menu-item-icon"),
      tooltip: section.name,
      action: () => scrollToSection(section.key),
      key: `menu-section-${section.key}`,
    }));

    const pageItems: MenuItemType[] = [
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
    ];

    if (pathname === "/") {
      return [...baseItems, ...pageItems, ...sectionItems];
    } else {
      return [...baseItems, ...pageItems];
    }
  }, [pathname, scrollToSection, isDark, isMuted]);

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
      <div className="menu-data">
        <MenuToggle isMobile={isMobile} toggleMenu={() => setMenuActive((m) => !m)} />

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
