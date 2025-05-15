import styled, { keyframes } from "styled-components";
const pulsate = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;
export const StyledValentinesTitle = styled.h1`
  color: pink;
  font-size: 72px; /* Adjust the font size to make it bigger */
  text-shadow: 2px 2px 0px red, 4px 4px 0px #f06d06;
  animation: ${pulsate} 3s infinite;
`;
