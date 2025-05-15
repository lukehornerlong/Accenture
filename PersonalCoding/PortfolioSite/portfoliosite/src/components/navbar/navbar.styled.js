import styled from "styled-components";
import { motion } from "framer-motion";
export const Stylednavbardiv = styled.div`
  height: 100px;
  top: 0;
  background-color: #00322c;
`;

export const Styledwrapper = styled.div`
  max-width: 1336px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-weight: bolder;
  }
  height: 100%;
`;

export const Socialmediasholder = styled(motion.div)`
  display: flex;
  gap: 20px;
  img {
    width: 25px;
  }
`;
