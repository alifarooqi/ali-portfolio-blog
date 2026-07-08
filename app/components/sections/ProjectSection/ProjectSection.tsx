"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { motion, AnimatePresence } from "motion/react";

import Section from "../../Section/Section";
import { getIcon } from "../../icons/Icons";
import SectionConfig from "../../../config/SectionConfig";
import Projects from "./Projects";
import "./ProjectSection.scss";

const projectSectionConfig = SectionConfig.find((section) => section.key === "projects")!;

const coverImages = [
  "/images/projects/iam_security.jpg",
  "/images/projects/energy_efficiency.jpg",
  "/images/projects/eczetrack.jpg",
  "/images/projects/tic_tac_toe.jpg",
  "/images/projects/simon_game.jpg",
  "/images/projects/pomodoro_timer.jpg"
];

// Helper to synthesize modern interface sci-fi sounds
const playInterfaceSound = (type: "hover" | "select" | "toggle", isMuted: boolean) => {
  if (isMuted || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "hover") {
      // Futuristic click/tick
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "select") {
      // Sci-fi energy sweep
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
      
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 6;
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.25);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "toggle") {
      // Futuristic slide toggle beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(780, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    console.warn("AudioContext playback interrupted:", e);
  }
};

interface Card3DProps {
  project: typeof Projects[number];
  isSelected: boolean;
  onClick: () => void;
  coverImage: string;
  isMuted: boolean;
}

// 3D Parallax Game Cover Card
const Card3D = ({ project, isSelected, onClick, coverImage, isMuted }: Card3DProps) => {
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
    playInterfaceSound("hover", isMuted);
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
      <div 
        className="card-cover-wrapper"
        style={{
          backgroundImage: `url(${coverImage})`
        }}
      >
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
  const [isMuted, setIsMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // Keyboard navigation listener (Arrow keys + Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % Projects.length);
        playInterfaceSound("hover", isMuted);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + Projects.length) % Projects.length);
        playInterfaceSound("hover", isMuted);
      } else if (e.key === "Enter" || e.key === " ") {
        const activeProj = Projects[selectedIndex];
        if (activeProj.links.length > 0) {
          e.preventDefault();
          playInterfaceSound("select", isMuted);
          window.open(activeProj.links[0].link, "_blank");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isMuted]);

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
          <button 
            className="sound-toggle-btn"
            onClick={() => {
              const nextMutedState = !isMuted;
              setIsMuted(nextMutedState);
              playInterfaceSound("toggle", nextMutedState);
            }}
            aria-label="Toggle system sound effects"
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </button>
        </div>

        {/* Dashboard workspace grid */}
        <div className="dashboard-grid">
          {/* Main game select slider list */}
          <div className="carousel-view-port">
            <div className="carousel-list">
              {Projects.map((project, index) => (
                <Card3D
                  key={"proj-card-" + index}
                  project={project}
                  isSelected={index === selectedIndex}
                  coverImage={coverImages[index]}
                  isMuted={isMuted}
                  onClick={() => {
                    setSelectedIndex(index);
                    playInterfaceSound("select", isMuted);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sci-Fi Inspect details pane */}
          <div className="inspect-details-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
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
                          onMouseEnter={() => playInterfaceSound("hover", isMuted)}
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
