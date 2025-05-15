import styled, { keyframes } from "styled-components";
const cascade = keyframes`
  0% {
    transform: translateY(0) rotate(45deg);
  }
  100% {
    transform: translateY(150vh) rotate(45deg);
  }
`;

export const Heart = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  top: -10%;
  left: ${(props) => props.position}%;
  transform: rotate(45deg);
  animation: ${cascade} ${(props) => props.speed}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  opacity: ${(props) => props.opacity};
  color: ${(props) => props.color};

  &::before {
    content: "♥";
    font-size: ${(props) => props.size}px;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

// Background component
export const Background = styled.div`
  z-index: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
