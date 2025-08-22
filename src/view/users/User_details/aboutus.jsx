import React from 'react';
import './aboutus.css'; // optional CSS file
import myImage from '../../../Assets/male-avatar-boy-face-man-user-9-svgrepo-com.svg'

const AboutUs = () => {
  return (
    <div>
      <header className="header">
        <h1>About Us</h1>
      </header>

      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              We aim to provide top-quality educational solutions and empower students and teachers 
              with innovative tools for learning and collaboration.
            </p>

            <h2>Our Vision</h2>
            <p>
              To become a leading platform where education meets technology, fostering growth, creativity,
              and engagement for learners everywhere.
            </p>
          </div>
          <div className="about-image">
            <img src={myImage} alt="Our Team" />
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="about-container">
          <h2>Meet Our Team</h2>
          <div className="team-cards">
            <div className="card">
              <img src={myImage} alt="Team Member" />
              <h3>John Doe</h3>
              <p>Founder & CEO</p>
            </div>
            <div className="card">
              <img src={myImage} alt="Team Member" />
              <h3>Jane Smith</h3>
              <p>Lead Developer</p>
            </div>
            <div className="card">
              <img src={myImage} alt="Team Member" />
              <h3>Emily Brown</h3>
              <p>Designer</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
