import styled from "styled-components";
import { motion } from "framer-motion";
export const StyledToggleButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  top: 25px;
  left: 25px;
  background-color: transparent;
  border: none;
  z-index: 999;

  &:hover {
    cursor: pointer;
  }
`;
