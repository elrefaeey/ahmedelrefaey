"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { supabase, type Project } from "@/lib/supabase"
import AdminPanel from "@/components/admin-panel"
import LoginModal from "@/components/login-modal"

export default function Portfolio() {
  const [currentLang, setCurrentLang] = useState("en")
  const [animatedElements, setAnimatedElements] = useState(new Set())
  const [projects, setProjects] = useState<Project[]>([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [loading, setLoading] = useState(true)

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en"
    setCurrentLang(newLang)

    // Update document attributes
    document.documentElement.setAttribute("lang", newLang)
    document.documentElement.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr")
  }

  const getText = (enText: string, arText: string) => {
    return currentLang === "ar" ? arText : enText
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")

      elements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < window.innerHeight - elementVisible) {
          setAnimatedElements((prev) => {
            if (!prev.has(index)) {
              const newSet = new Set(prev)
              newSet.add(index)
              return newSet
            }
            return prev
          })
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const smoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleAdminLogin = () => {
    setShowLoginModal(false)
    setShowAdminPanel(true)
  }

  const handleAdminPanelClose = () => {
    setShowAdminPanel(false)
    fetchProjects() // Refresh projects when admin panel closes
  }

  return (
    <div className={`min-h-screen ${currentLang === "ar" ? "rtl" : "ltr"}`}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-gold: #d4af37;
          --gold-light: #f4e4a6;
          --gold-dark: #b8941f;
          --accent-gold: #ffd700;
          --neon-gold: #ffed4e;
          --text-primary: #1a1a1a;
          --text-secondary: #4a4a4a;
          --text-muted: #6a6a6a;
          --bg-primary: #ffffff;
          --bg-secondary: #fafafa;
          --bg-card: #ffffff;
          --border-color: #e5e7eb;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          --shadow-gold: 0 4px 20px rgba(212, 175, 55, 0.3);
          --shadow-gold-lg: 0 10px 30px rgba(212, 175, 55, 0.4);
          --glow-gold: 0 0 20px rgba(255, 215, 0, 0.6);
          --glow-gold-intense: 0 0 30px rgba(255, 215, 0, 0.8);
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: var(--text-primary);
          background: var(--bg-primary);
          overflow-x: hidden;
        }

        /* Add Arabic font support */
        body[dir="rtl"] {
          font-family: 'Ruqaa', 'Noto Naskh Arabic', 'Traditional Arabic', 'Tahoma', sans-serif;
        }

        .rtl {
          direction: rtl;
          font-family: 'Ruqaa', 'Noto Naskh Arabic', 'Traditional Arabic', 'Tahoma', sans-serif;
        }

        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          z-index: 1000;
          padding: 1rem 0;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: bold;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold), var(--neon-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: var(--glow-gold);
          animation: logoGlow 3s ease-in-out infinite alternate;
          transition: all 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
          filter: drop-shadow(var(--glow-gold-intense));
        }

        @keyframes logoGlow {
          from { 
            filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.4));
            transform: translateY(0);
          }
          to { 
            filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
            transform: translateY(-2px);
          }
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2.5rem;
          align-items: center;
        }

        .nav-links a {
          text-decoration: none;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 0.5rem 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-gold), var(--accent-gold));
          transition: width 0.3s ease;
          box-shadow: var(--glow-gold);
        }

        .nav-links a:hover {
          filter: drop-shadow(var(--glow-gold));
          transform: translateY(-2px);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .lang-toggle {
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          color: white;
          border: none;
          padding: 0.7rem 1.5rem;
          border-radius: 2rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-gold);
          position: relative;
          overflow: hidden;
        }

        .lang-toggle::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .lang-toggle:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: var(--shadow-gold-lg), var(--glow-gold-intense);
        }

        .lang-toggle:hover::before {
          left: 100%;
        }

        /* Floating Social Icons - Bottom Left */
        .floating-social {
          position: fixed;
          left: 2rem;
          bottom: 2rem;
          z-index: 999;
          display: flex;
          flex-direction: row;
          gap: 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .rtl .floating-social {
          left: auto;
          right: 2rem;
        }

        .social-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          animation: socialFloat 4s ease-in-out infinite;
        }

        .social-icon:nth-child(1) {
          animation-delay: 0s;
        }

        .social-icon:nth-child(2) {
          animation-delay: 2s;
        }

        @keyframes socialFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-2deg); }
        }

        .social-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .social-icon:hover::before {
          left: 100%;
        }

        .whatsapp-icon {
          background: linear-gradient(135deg, #25d366, #128c7e);
        }

        .whatsapp-icon:hover {
          transform: translateY(-5px) scale(1.15) rotate(5deg);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.5), 0 0 20px rgba(37, 211, 102, 0.3);
        }

        .instagram-icon {
          background: linear-gradient(135deg, #e4405f, #833ab4, #fd1d1d, #fcb045);
        }

        .instagram-icon:hover {
          transform: translateY(-5px) scale(1.15) rotate(-5deg);
          box-shadow: 0 12px 30px rgba(228, 64, 95, 0.5), 0 0 20px rgba(228, 64, 95, 0.3);
        }

        .social-icon svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          position: relative;
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
          animation: backgroundShift 8s ease-in-out infinite alternate;
        }

        @keyframes backgroundShift {
          0% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.1); }
        }

        .hero-content {
          max-width: 900px;
          opacity: 1;
          transform: translateY(0);
          animation: heroFadeIn 2s ease;
          position: relative;
          z-index: 2;
        }

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .hero h1 {
          font-size: 4rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, var(--accent-gold), var(--primary-gold), var(--neon-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: var(--glow-gold);
          animation: titleFloat 6s ease-in-out infinite;
          transition: all 0.3s ease;
        }

        .hero h1:hover {
          transform: scale(1.05);
          filter: drop-shadow(var(--glow-gold-intense));
        }

        @keyframes titleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(0deg); }
          75% { transform: translateY(-15px) rotate(-1deg); }
        }

        .hero .subtitle {
          font-size: 1.6rem;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          font-weight: 600;
          animation: subtitleGlow 4s ease-in-out infinite alternate;
        }

        @keyframes subtitleGlow {
          from { 
            opacity: 0.8;
            filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
          }
          to { 
            opacity: 1;
            filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
          }
        }

        .hero .description {
          font-size: 1.3rem;
          background: linear-gradient(45deg, var(--text-secondary), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2.5rem;
          line-height: 1.8;
          animation: fadeInUp 1.5s ease 0.5s both;
        }

        .cta-button {
          display: inline-block;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          color: white;
          padding: 1.2rem 2.5rem;
          text-decoration: none;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 1.1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-gold);
          cursor: pointer;
          border: none;
          position: relative;
          overflow: hidden;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.6s ease;
        }

        .cta-button:hover {
          transform: translateY(-5px) scale(1.08);
          box-shadow: var(--shadow-gold-lg), var(--glow-gold-intense);
          background: linear-gradient(45deg, var(--accent-gold), var(--neon-gold));
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .section-title {
          font-size: 3rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 4rem;
          background: linear-gradient(45deg, var(--accent-gold), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: var(--glow-gold);
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-title.animate {
          opacity: 1;
          transform: translateY(0);
          filter: drop-shadow(var(--glow-gold));
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .project-card {
          background: var(--bg-card);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: translateY(30px);
          border: 1px solid var(--border-color);
          position: relative;
        }

        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary-gold), var(--accent-gold));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .project-card.animate {
          opacity: 1;
          transform: translateY(0);
          animation: projectSlideIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes projectSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(50px) rotateX(10deg) scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) rotateX(0deg) scale(1); 
          }
        }

        .project-card:hover {
          transform: translateY(-15px) scale(1.03) rotateY(2deg);
          box-shadow: var(--shadow-lg), var(--glow-gold);
        }

        .project-card:hover::before {
          opacity: 1;
          box-shadow: var(--glow-gold);
        }

        .project-image {
          width: 100%;
          height: 220px;
          position: relative;
          overflow: hidden;
        }

        .project-image img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-card:hover .project-image img {
          transform: scale(1.1) rotate(2deg);
        }

        .project-content {
          padding: 2rem;
        }

        .project-title {
          font-size: 1.4rem;
          font-weight: bold;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }

        .project-card:hover .project-title {
          filter: drop-shadow(var(--glow-gold));
        }

        .project-description {
          background: linear-gradient(45deg, var(--text-secondary), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.7;
          font-size: 1rem;
        }

        .project-link {
          display: inline-block;
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
          border-bottom: 2px solid transparent;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-link:hover {
          border-bottom-color: var(--accent-gold);
          transform: translateX(10px);
          filter: drop-shadow(var(--glow-gold));
        }

        .about {
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .about::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
          animation: aboutGlow 6s ease-in-out infinite alternate;
        }

        @keyframes aboutGlow {
          0% { opacity: 0.3; }
          100% { opacity: 0.7; }
        }

        .about-content {
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
          padding: 2rem;
          border-radius: 1rem;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow);
          position: relative;
          z-index: 2;
        }

        .about-content.animate {
          opacity: 1;
          transform: translateY(0);
          box-shadow: var(--shadow-lg), var(--glow-gold);
        }

        .about-text {
          font-size: 1.2rem;
          background: linear-gradient(45deg, var(--text-secondary), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.9;
          margin-bottom: 2.5rem;
        }

        .skills {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .skill-tag {
          background: linear-gradient(45deg, var(--primary-gold), var(--accent-gold));
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 2rem;
          font-size: 1rem;
          font-weight: 600;
          box-shadow: var(--shadow-gold);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: skillFloat 4s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .skill-tag:nth-child(odd) {
          animation-delay: 0.5s;
        }

        .skill-tag:nth-child(even) {
          animation-delay: 1s;
        }

        .skill-tag::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        @keyframes skillFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(-3px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-2deg); }
        }

        .skill-tag:hover {
          transform: translateY(-5px) scale(1.15) rotate(5deg);
          box-shadow: var(--shadow-gold-lg), var(--glow-gold-intense);
        }

        .skill-tag:hover::before {
          left: 100%;
        }

        .footer {
          background: var(--bg-secondary);
          color: var(--text-secondary);
          text-align: center;
          padding: 3rem;
          border-top: 1px solid var(--border-color);
          position: relative;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-gold), transparent);
          box-shadow: var(--glow-gold);
        }

        .footer-text {
          background: linear-gradient(45deg, var(--text-secondary), var(--primary-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: inherit;
        }

        .admin-lock-footer {
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1em;
          opacity: 0.7;
          filter: grayscale(1);
        }

        .admin-lock-footer:hover {
          opacity: 1;
          transform: scale(1.2) rotate(10deg);
          filter: grayscale(0) drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .floating-social {
            left: 1rem;
            bottom: 1rem;
            gap: 0.8rem;
          }

          .rtl .floating-social {
            left: auto;
            right: 1rem;
          }

          .social-icon {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }

          .social-icon svg {
            width: 20px;
            height: 20px;
          }

          .hero h1 {
            font-size: 2.8rem;
          }

          .hero .subtitle {
            font-size: 1.3rem;
          }

          .hero .description {
            font-size: 1.1rem;
          }

          .section {
            padding: 4rem 1rem;
          }

          .section-title {
            font-size: 2.2rem;
          }

          .projects-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .skills {
            gap: 1rem;
          }

          .skill-tag {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }

          .footer-text {
            flex-direction: column;
            gap: 0.3rem;
          }
        }
      `}</style>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleAdminLogin}
        currentLang={currentLang}
      />

      {/* Admin Panel */}
      <AdminPanel isOpen={showAdminPanel} onClose={handleAdminPanelClose} currentLang={currentLang} />

      {/* Floating Social Icons */}
      <div className="floating-social">
        <a
          href="https://wa.me/201092940685"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon whatsapp-icon"
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
          </svg>
        </a>
        <a
          href="https://instagram.com/el.refaeyy"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon instagram-icon"
          title="Instagram"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">Ahmed Elrefaey</div>
          <ul className="nav-links">
            <li>
              <a onClick={() => smoothScroll("home")}>{getText("Home", "الرئيسية")}</a>
            </li>
            <li>
              <a onClick={() => smoothScroll("projects")}>{getText("Projects", "المشاريع")}</a>
            </li>
            <li>
              <a onClick={() => smoothScroll("about")}>{getText("About", "نبذة")}</a>
            </li>
            <li>
              <button className="lang-toggle" onClick={toggleLanguage}>
                {currentLang === "en" ? "العربية" : "English"}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>{getText("Ahmed Elrefaey", "أحمد الرفاعي")}</h1>
          <div className="subtitle">
            {getText(
              "Frontend Developer & Computer and Communications Engineer",
              "مطور واجهات أمامية ومهندس حاسوب واتصالات",
            )}
          </div>
          <p className="description">
            {getText(
              "A passionate frontend developer with experience in HTML, CSS, and JavaScript. I've worked on several real-world projects like accessory e-commerce sites and a photography landing page.",
              "مطور واجهات أمامية شغوف بخبرة في HTML و CSS و JavaScript. عملت على عدة مشاريع حقيقية مثل مواقع التجارة الإلكترونية للإكسسوارات وصفحة هبوط للتصوير الفوتوغرافي.",
            )}
          </p>
          <button className="cta-button" onClick={() => smoothScroll("projects")}>
            {getText("View My Work", "اطلع على أعمالي")}
          </button>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <h2 className={`section-title animate-on-scroll ${animatedElements.has(0) ? "animate" : ""}`}>
          {getText("My Projects", "مشاريعي")}
        </h2>
        {loading ? (
          <div className="text-center py-8">{getText("Loading projects...", "جاري تحميل المشاريع...")}</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`project-card animate-on-scroll ${animatedElements.has(1 + index) ? "animate" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-image">
                  <Image
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.alt_text || "Project image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="project-content">
                  <h3 className="project-title">{currentLang === "ar" ? project.title_ar : project.title_en}</h3>
                  <p className="project-description">
                    {currentLang === "ar" ? project.description_ar : project.description_en}
                  </p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    {getText("View Live Site", "عرض الموقع المباشر")} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <h2 className={`section-title animate-on-scroll ${animatedElements.has(5) ? "animate" : ""}`}>
          {getText("About Me", "نبذة عني")}
        </h2>
        <div className={`about-content animate-on-scroll ${animatedElements.has(6) ? "animate" : ""}`}>
          <p className="about-text">
            {getText(
              "I'm a Computer and Communications Engineer studying at Mansoura University with a passion for creating beautiful and functional web experiences. My expertise lies in frontend development, where I combine technical skills with creative design to build engaging user interfaces.",
              "أنا مهندس حاسوب واتصالات أدرس في جامعة المنصورة مع شغف لإنشاء تجارب ويب جميلة وعملية. خبرتي تكمن في تطوير الواجهات الأمامية، حيث أجمع بين المهارات التقنية والتصميم الإبداعي لبناء واجهات مستخدم جذابة.",
            )}
          </p>
          <div className="skills">
            <span className="skill-tag">HTML5</span>
            <span className="skill-tag">CSS3</span>
            <span className="skill-tag">JavaScript</span>
            <span className="skill-tag">{getText("Responsive Design", "التصميم المتجاوب")}</span>
            <span className="skill-tag">{getText("E-commerce", "التجارة الإلكترونية")}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">
          <span
            className="admin-lock-footer"
            onClick={() => setShowLoginModal(true)}
            title={getText("Admin Access", "دخول الإدارة")}
          >
            © 🔒
          </span>
          {getText("2024 Ahmed Elrefaey. All rights reserved.", "2024 أحمد الرفاعي. جميع الحقوق محفوظة.")}
        </div>
      </footer>
    </div>
  )
}
