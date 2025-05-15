import styled from "styled-components";
import { motion } from "framer-motion";

export const Styledaboutme = styled(motion.div)`
  position: relative;
`;

export const StyledProgress = styled(motion.div)`
  position: sticky;
  top: 0;
  left: 0;
  padding-top: 50px;
  text-align: center;
  // color: #005046;
  font-size: 36px;

  @include mobile {
    padding-top: calc(100vh - 100px);
    font-size: 24px;
  }
`;
export const StyledProgressBar = styled(motion.div)`
  height: 10px;
  background-color: #00aff5;
`;

export const StyledAboutMeContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const StyledAboutMeWrapper = styled(motion.div)`
  max-width: 1366px;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

export const StyledAboutMeimgcontainer = styled(motion.div)`
  flex: 1;
  height: 50%;

  @include mobile {
    width: 100%;
    max-height: 300px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;

    @include mobile {
      object-fit: contain;
    }
  }
`;
export const StyledAboutMeTextcontainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @include mobile {
    transform: none !important;
    padding: 10px;
    align-items: center;
    text-align: center;
  }
`;
export const StyledaboutmeH2 = styled.h2`
  font-size: 72px;
  //color: #f1ecbe;
  @include mobile {
    font-size: 36px;
  }
`;
export const StyledaboutmeButton = styled.a`
  background-color: #006992;
  border: none;
  border-radius: 10px;
  padding: 10px;
  width: 200px;
  cursor: pointer;
`;
export const StyledaboutmeP = styled.p`
  color: #47383d;
  font-size: 20px;

  @include mobile {
    font-size: 16px;
  }
`;
