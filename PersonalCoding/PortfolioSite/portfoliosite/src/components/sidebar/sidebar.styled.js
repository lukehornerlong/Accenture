import styled from "styled-components";
import { motion } from "framer-motion";
export const StyledSidebar = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledBackground = styled(motion.div)`
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  width: 400px;
  background-color: #f1ecbe;
  color: #47383d;
  z-index: 998;
  @media (max-width: 500px) {
    width: 100%;
  }
`;
