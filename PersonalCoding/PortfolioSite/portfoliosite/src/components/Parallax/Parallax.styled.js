import styled from "styled-components";
import { motion } from "framer-motion";
export const StyledParallax = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
export const StyledH1 = styled(motion.h1)`
  font-size: 100px;

  @include mobile {
    font-size: 72px;
    text-align: center;
  }
`;
export const StyledSquiggles = styled(motion.div)`
  background-image: url("/abstractscenery.png");
  background-size: cover;
  background-position: bottom;
  width: 100%;
  height: 100%;
  position: absolute;
`;

export const StyledAboutmePics = styled(motion.div)`
  background-image: url("/aboutmepics.png");
  background-size: cover;
  background-position: bottom;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  @include mobile {
    background-size: contain;
    background-repeat: no-repeat;
  }
`;

export const StyledContactmePics = styled(motion.div)`
  background-image: url("/contactmepics.png");
  background-size: cover;
  background-position: bottom;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  @include mobile {
    background-size: contain;
    background-repeat: no-repeat;
  }
`;
