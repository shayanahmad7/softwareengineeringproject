// Import React for component creation.
import React from 'react';

// Import images from the assets folder.
import heroImage from '../assets/hero.jpg';


// Import the global stylesheet that affects the whole application.
import '../styles/styles.css';

// Define the LandingPage component as a functional component.
const LandingPage = () => {
  // The component returns JSX that renders the landing page UI.
  return (
    <div>
      {/* Header section with background image and registration form */}
      <header className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <h1>Abu Dhabi Eats</h1>
        {/* Registration form with email and password fields */}
        <form className="register-form">
          <h2>Register Now</h2>
          <input type="email" placeholder="Enter your email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
      </header>
      {/* Section explaining how the app works with three features */}
      <section className="how-it-works">
        <div className="feature large">
          <h2>AI-Powered Meal Planning</h2>
          <p>
            Experience customized meal planning with our cutting-edge AI that
            considers your dietary preferences and health goals.
          </p>
          
        </div>
        <div className="feature large">
          <h2>Comprehensive Local Restaurant Database</h2>
          <p>
            Choose meals from a wide range of local restaurants, with detailed
            information on menus and dietary specifics.
          </p>
          
        </div>
        <div className="feature large">
          <h2>Order Directly Through the App</h2>
          <p>
            Seamlessly order your preferred meals directly through our app,
            linking you to local eateries for quick and convenient delivery.
          </p>
          
        </div>
      </section>
      {/* About us section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          Learn more about our mission to make healthy eating simple and
          accessible for everyone in Abu Dhabi.
        </p>
      </section>
      {/* Footer section with contact and policy information */}
      <footer>
        <p>Contact Us</p>
        <p>Privacy Policy</p>
      </footer>
    </div>
  );
};

// Export the LandingPage component to be used in other parts of the application.
export default LandingPage;
