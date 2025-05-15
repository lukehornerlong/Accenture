import React from "react";
import { motion } from "framer-motion";
import {
  StyledButtonsContainer,
  StyledHomepage,
  StyledHompageTextcontainer,
  StyledHompageWrapper,
  StyledImageContainer,
  StyledSlidingTextContainer,
} from "./Homepage.styled";
import { Link } from "react-router-dom";
const textVariants = {
  initial: {
    x: -500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};
const sliderVariants = {
  initial: {
    x: 0,
  },
  animate: {
    x: "-220%",
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 20,
    },
  },
};

const Homepage = () => {
  return (
    <StyledHomepage>
      <StyledHompageWrapper>
        <StyledHompageTextcontainer>
          <h2>Luke Horner-Long</h2>
          <h1>Computer Science Student @ University of Birmingham</h1>
          <StyledButtonsContainer>
            <a href={`${window.location.origin}/#/Projects`}>See my projects</a>

            <a href={`${window.location.origin}/Contact`}>Contact me</a>
          </StyledButtonsContainer>
          <motion.img
            variants={textVariants}
            animate="scrollButton"
            src="/scroll.png"
            alt=""
          ></motion.img>
        </StyledHompageTextcontainer>
      </StyledHompageWrapper>
      <StyledSlidingTextContainer
        variants={sliderVariants}
        initial="initial"
        animate="animate"
      >
        Luke Horner-Long
      </StyledSlidingTextContainer>
      <StyledImageContainer>
        <img src="luke.png"></img>
      </StyledImageContainer>
    </StyledHomepage>
  );
};
export default Homepage;
