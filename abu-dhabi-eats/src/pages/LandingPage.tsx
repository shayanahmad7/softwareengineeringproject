
import '../styles/landingPage.css';  

const LandingPage = () => {
  return (
    <>
      <header>
        <a href="#" className="logo">Abu Dhabi Eats</a>
      </header>
      <div className="container">
        <div className="text-container1">
          <h1>Reach your goals</h1>
        </div>
        <div className="text-container2">
          <h1>with Abu Dhabi Eats</h1>
        </div>
        <p>Build healthy habits with the all-in-one food, exercise, and calorie tracker.</p>
        <button className="button">Start Today <span className="arrow">{'>'}</span></button>
      </div>
    </>
  );
};

export default LandingPage;