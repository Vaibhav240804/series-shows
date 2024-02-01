import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import "./App.css";
import { animated } from "react-spring";
import "./popup.css";

function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

function Image({ show }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  return (
    <section>
      <div ref={ref}>
        <button
          className="button"
          onClick={() => {
            localStorage.setItem("selectedShow", show.show.name);
            localStorage.setItem("isSelected", true);
          }}
        >
          <img src={show.show.image.medium} alt={show.show.summary} />
        </button>
      </div>
      <motion.div className="overlay-2" style={{ y }}>
        <h2>{show.show.name}</h2>
        <p>{show.show.summary}</p>
      </motion.div>
    </section>
  );
}

function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let storedData = localStorage.getItem("tvData");

        if (storedData === null) {
          const response = await axios.get(
            "https://api.tvmaze.com/search/shows?q=all"
          );
          storedData = response.data;
          localStorage.setItem("tvData", JSON.stringify(storedData));
        } else {
          storedData = JSON.parse(storedData);
        }
        setShows(storedData);
        console.log(typeof shows); // Check the data type
      } catch (error) {
        console.error("Error fetching data:", error);
        setShows([]);
      }
    };

    fetchData();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(true);
  const [selectedShow, setSelectedShow] = useState("");

  useEffect(() => {
    const selectedShow = localStorage.getItem("selectedShow");
    setSelectedShow(selectedShow);
    const isSelected = localStorage.getItem("isSelected");
    if (isSelected === "true") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [selectedShow]);

  const popupAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0%)" : "translateY(-50%)",
  });

  const closePopup = () => {
    setIsVisible(false);
  };

  return (
    <>
      {shows.map(
        (show) =>
          show.show.image && (
            <div key={show.show.id}>
              <Image show={show} />
            </div>
          )
      )}
      <motion.div className="progress" style={{ scaleX }} />
      <animated.div style={popupAnimation} className="popup-container">
        <div className="popup-content">
          <span onClick={closePopup} className="close-button">
            &times;
          </span>
          <h2>{selectedShow}</h2>
          <p>This is your animated popup content.</p>
        </div>
      </animated.div>
    </>
  );
}

export default Home;
