import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import "./popup.css";

const Popup = ({ name }) => {
  const [isVisible, setIsVisible] = useState(true);
  const popupAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0%)" : "translateY(-50%)",
  });

  const closePopup = () => {
    setIsVisible(false);
  };

  const selectedShow = localStorage.getItem("selectedShow");
  return (
    <animated.div style={popupAnimation} className="popup-container">
      <div className="popup-content">
        <span onClick={closePopup} className="close-button">
          &times;
        </span>
        <h2>{selectedShow}</h2>
        <p>This is your animated popup content.</p>
      </div>
    </animated.div>
  );
};

export default Popup;
