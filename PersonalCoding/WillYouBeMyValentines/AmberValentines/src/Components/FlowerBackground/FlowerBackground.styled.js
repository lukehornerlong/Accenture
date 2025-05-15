import styled, { keyframes } from "styled-components";

// Styled flower component
export const Flower = styled.svg`
  position: fixed;
  color: ${(props) => props.color}; // Set the color of the flower text
  font-size: ${(props) => props.size}px;
  top: ${(props) => props.position.top}px;
  left: ${(props) => props.position.left}px;
`;
