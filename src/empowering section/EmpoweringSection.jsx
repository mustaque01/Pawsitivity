import React from 'react'
import './EmpoweringSection.css';

export default function EmpoweringSection() {
  return (
    <div className="empowering-section mt-2">
      {/* Decorative star */}
      <div className="empowering-star">
        <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
          <path d="M30 0L35 20L55 15L40 30L60 35L40 40L55 55L35 40L30 60L25 40L5 55L20 40L0 35L20 30L5 15L25 20L30 0Z" fill="#2D2D2D"/>
        </svg>
      </div>

      {/* Main content */}
      <div className="empowering-content">
        <div className="empowering-left-content">
          <h1 className="empowering-title">Empowering Communities,</h1>
          <p className="empowering-subtitle">Protecting Lives</p>
          <div className="empowering-mission">
            <p className="empowering-mission-text">
              At Pawsitivity, we are driven by a deep commitment to social welfare, women empowerment, and animal safety. Every reflective collar we create not only protects street animals but also provides dignified employment to underprivileged women. Our mission goes beyond products—it's about creating a safer world for animals and people alike.
            </p>
          </div>
          <div className="empowering-form-section">
            <div className="empowering-form-wrapper">
              <button className="empowering-shop-btn">Shop Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative paw prints */}
      <div className="empowering-paw-prints">
        <div className="paw-print paw-1">🐾</div>
        <div className="paw-print paw-2">🐾</div>
        <div className="paw-print paw-3">🐾</div>
        <div className="paw-print paw-4">🐾</div>
        <div className="paw-print paw-5">🐾</div>
        <div className="paw-print paw-6">🐾</div>
        <div className="paw-print paw-7">🐾</div>
        <div className="paw-print paw-8">🐾</div>
      </div>
      </div>
  )
}
