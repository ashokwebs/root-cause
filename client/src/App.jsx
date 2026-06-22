import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Problem from "./components/Problem.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import LiveDemo from "./components/LiveDemo.jsx";
import Architecture from "./components/Architecture.jsx";
import Team from "./components/Team.jsx";
import Footer from "./components/Footer.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import "./App.css";

const SECTION_IDS = ["hero", "problem", "how-it-works", "demo", "architecture", "team"];

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [view, setView] = useState("landing"); // 'landing' | 'teacher'

  // IntersectionObserver for active nav tracking
  useEffect(() => {
    if (view !== "landing") return;
    const observers = [];
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(handleIntersect, {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [view]);

  // Scroll-reveal animation
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.1 }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  return (
    <div className="app">
      <Navbar activeSection={activeSection} view={view} setView={setView} />
      
      {view === "landing" ? (
        <>
          <Hero />
          <div className="section-divider" />
          <Problem />
          <div className="section-divider" />
          <HowItWorks />
          <div className="section-divider" />
          <LiveDemo />
          <div className="section-divider" />
          <Architecture />
          <div className="section-divider" />
          <Team />
        </>
      ) : (
        <TeacherDashboard />
      )}
      
      <Footer />
    </div>
  );
}
