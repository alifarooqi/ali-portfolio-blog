"use client";

import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion, AnimatePresence } from "motion/react";

import Section from "../../Section/Section";
import { getIcon } from "../../icons/Icons";
import SectionConfig from "../../../config/SectionConfig";
import { playSound } from "@/lib/sound";
import Projects from "./Projects";
import "./ProjectSection.scss";

const projectSectionConfig = SectionConfig.find((section) => section.key === "projects")!;

const coverImages = [
  "/images/projects/antigravity_telegram_bridge.webp",
  "/images/projects/iam_security.webp",
  "/images/projects/energy_efficiency.webp",
  "/images/projects/eczetrack.webp",
  "/images/projects/tic_tac_toe.webp",
  "/images/projects/simon_game.webp",
  "/images/projects/pomodoro_timer.webp"
];

interface Card3DProps {
  project: typeof Projects[number];
  isSelected: boolean;
  onClick: () => void;
  coverImage: string;
  priority?: boolean;
}

// 3D Parallax Game Cover Card
const Card3D = ({ project, isSelected, onClick, coverImage, priority }: Card3DProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setHovering(true);
    playSound("hover");
  };

  const handleMouseLeave = () => {
    setHovering(false);
    setCoords({ x: 0, y: 0 });
  };

  // Compute rotation coordinates based on mouse position relative to center of card
  const rotateX = hovering ? -(coords.y / 150) * 12 : 0;
  const rotateY = hovering ? (coords.x / 110) * 12 : 0;

  // Spotlight highlight positioning
  const spotlightX = hovering ? ((coords.x + 110) / 220) * 100 : 50;
  const spotlightY = hovering ? ((coords.y + 150) / 300) * 100 : 50;

  return (
    <div
      ref={cardRef}
      className={`game-card ${isSelected ? "selected" : ""}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${hovering ? 1.05 : 1})`,
        transition: hovering ? "none" : "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
    >
      <div className="card-cover-wrapper">
        <Image
          className="card-cover-image"
          src={coverImage}
          alt={`${project.name} cover`}
          fill
          sizes="(min-width: 768px) 210px, 170px"
          priority={priority}
        />
        <div
          className="card-spotlight"
          style={{
            background: hovering 
              ? `radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(255, 255, 255, 0.18), transparent 60%)`
              : "none"
          }}
        />
        <div className="card-glass-glow" />
        <div className="card-game-title-overlay">
          <div className="card-icon-container">{project.icon}</div>
          <span className="card-game-title">{project.name}</span>
        </div>
      </div>
    </div>
  );
};

const ProjectSection = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);

  // Background Particle System Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }> = [];

    // Create 45 ambient floating dust particle entities
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.25 + 0.05),
        speedX: (Math.random() * 0.15 - 0.075),
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60, 131, 246, ${p.opacity})`;
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around boundary resets
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Programmatic scroll-to-index handler (used by arrow clicks & pagination dots)
  const scrollToIndex = useCallback((index: number) => {
    const container = carouselRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const cardElement = container.children[index] as HTMLElement;
    if (cardElement) {
      // Center the active card in the viewport
      const leftPosition = cardElement.offsetLeft - (container.offsetWidth / 2) + (cardElement.offsetWidth / 2);
      container.scrollTo({
        left: leftPosition,
        behavior: "smooth"
      });
    }
    setSelectedIndex(index);
    playSound("select");

    // Release scroll block after smooth scrolling animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 450);
  }, []);

  // Scroll listener to update selectedIndex on manual scroll/swipe
  const handleScroll = () => {
    if (isScrollingRef.current) return;
    const container = carouselRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== selectedIndex) {
      setSelectedIndex(closestIndex);
      playSound("hover");
    }
  };

  // Keyboard navigation listener (Arrow keys + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        const nextIndex = (selectedIndex + 1) % Projects.length;
        scrollToIndex(nextIndex);
      } else if (e.key === "ArrowLeft") {
        const nextIndex = (selectedIndex - 1 + Projects.length) % Projects.length;
        scrollToIndex(nextIndex);
      } else if (e.key === "Enter" || e.key === " ") {
        const activeProj = Projects[selectedIndex];
        if (activeProj.links.length > 0) {
          e.preventDefault();
          playSound("select");
          window.open(activeProj.links[0].link, "_blank");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, scrollToIndex]);

  // Adjust scroll position if container is resized/initialized
  useEffect(() => {
    // Timeout to ensure offset positions are fully rendered in the DOM
    const t = setTimeout(() => {
      const container = carouselRef.current;
      if (!container) return;
      const cardElement = container.children[selectedIndex] as HTMLElement;
      if (cardElement) {
        const leftPosition = cardElement.offsetLeft - (container.offsetWidth / 2) + (cardElement.offsetWidth / 2);
        container.scrollLeft = leftPosition;
      }
    }, 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeProject = Projects[selectedIndex];

  return (
    <Section ref={ref} sectionConfig={projectSectionConfig} extraClass="project-section">
      <div className="game-dashboard-container">
        {/* Dynamic ambient particle field */}
        <canvas ref={canvasRef} className="ambient-particles-canvas" />

        {/* Console Header bar */}
        <div className="dashboard-header">
          <div className="header-status-indicator">
            <span className="pulsing-led" />
            <span className="system-ready-label">SYSTEM READY // SELECT WORKPLACE ROM</span>
          </div>
        </div>

        {/* Unified Vertical Grid Layout */}
        <div className="dashboard-vertical-layout">
          
          {/* Top Row: Game selector with visual navigation arrows */}
          <div className="carousel-wrapper-layout">
            <button 
              className="carousel-nav-btn prev"
              onClick={() => {
                const prevIndex = (selectedIndex - 1 + Projects.length) % Projects.length;
                scrollToIndex(prevIndex);
              }}
              aria-label="Select previous project"
            >
              <ChevronLeftIcon />
            </button>

            <div className="carousel-view-port">
              <div className="carousel-list" ref={carouselRef} onScroll={handleScroll}>
                {Projects.map((project, index) => (
                  <Card3D
                    key={"proj-card-" + index}
                    project={project}
                    isSelected={index === selectedIndex}
                    coverImage={coverImages[index]}
                    priority={index === 0}
                    onClick={() => scrollToIndex(index)}
                  />
                ))}
              </div>
            </div>

            <button 
              className="carousel-nav-btn next"
              onClick={() => {
                const nextIndex = (selectedIndex + 1) % Projects.length;
                scrollToIndex(nextIndex);
              }}
              aria-label="Select next project"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Indicator Dots directly below Carousel */}
          <div className="carousel-pagination-dots">
            {Projects.map((_, index) => (
              <button
                key={"dot-" + index}
                className={`pagination-dot ${index === selectedIndex ? "active" : ""}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          {/* Bottom Row: Detailed Inspection Pane */}
          <div className="inspect-details-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="inspect-content"
              >
                <div className="inspect-header">
                  <div className="inspect-icon-container">{activeProject.icon}</div>
                  <div className="inspect-title-group">
                    <h3 className="inspect-project-title">{activeProject.name}</h3>
                    <h4 className="inspect-project-duration">
                      {getIcon("schedule")}
                      <span>{activeProject.duration}</span>
                    </h4>
                  </div>
                </div>

                <div className="inspect-body">
                  <div className="inspect-divider" />
                  <p className="inspect-description">{activeProject.description}</p>
                </div>

                <div className="inspect-footer">
                  {activeProject.links.length > 0 ? (
                    <div className="inspect-buttons-wrapper">
                      {activeProject.links.map((link, linkIndex) => (
                        <a
                          key={"inspect-btn-" + linkIndex}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sci-fi-action-button"
                          onMouseEnter={() => playSound("hover")}
                        >
                          <span className="btn-icon">{link.icon}</span>
                          <span className="btn-text">{link.tooltip}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="inspect-no-links-indicator">
                      <span>SECURE CLOUD PLATFORM // ACCESS RESTRICTED</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
});

ProjectSection.displayName = "ProjectSection";

export default ProjectSection;
