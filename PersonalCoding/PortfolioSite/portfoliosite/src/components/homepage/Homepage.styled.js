import styled from "styled-components";
import { motion } from "framer-motion";
export const StyledHomepage = styled(motion.div)`
  height: calc(100vh - 100px);
  overflow: hidden;
  background: linear-gradient(180deg, #00322c, #005046);
  position: relative;
`;

export const StyledImageContainer = styled(motion.div)`
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  user-select: none;
  @include mobile {
    height: 50%;
    width: 100%;
    top: unset;
    bottom: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const StyledHompageTextcontainer = styled(motion.div)`
  user-select: none;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 40px;

  h2 {
    font-size: 30px;
    color: #00aff5;
    letter-spacing: 10px;
  }

  h1 {
    font-size: 88px;
    color: #8cbdb0;

    @include mobile {
      font-size: 36px;
    }
  }
`;

export const StyledHompageWrapper = styled(motion.div)`
  max-width: 1366px;
  height: 100%;
  margin: auto;

  img {
    width: 50px;
  }

  @include mobile {
    height: 50%;
    width: 100%;
    gap: 20px;
    align-items: center;
    text-align: center;
  }
`;

export const StyledButtonsContainer = styled(motion.div)`
  z-index: 26;
  a {
    padding: 20px;
    border: 1px solid white;
    border-radius: 10px;
    background-color: transparent;
    color: white;
    margin-right: 20px;
    cursor: pointer;
    font-weight: 300;
    z-index: 26;
  }
`;

export const StyledSlidingTextContainer = styled(motion.div)`
  position: absolute;
  font-size: 50vh;
  bottom: -120px;
  white-space: nowrap;
  color: #8cbdb009;
  width: 50%;
  font-weight: bold;
  user-select: none;
`;
