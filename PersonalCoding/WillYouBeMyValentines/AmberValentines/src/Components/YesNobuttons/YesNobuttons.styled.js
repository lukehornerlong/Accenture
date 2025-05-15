import styled from "styled-components";
export const YesNoContainer = styled.div`
  text-align: center;
  z-index: 20;
`;

export const YesNoText = styled.h1`
  z-index: 20;

  color: lightblue;
  font-size: 48px;
  text-shadow: 2px 2px 0px blue, 4px 4px 0px darkblue;
`;

export const YesNoButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  z-index: 20;
`;

export const YesNoButton = styled.button`
  background-color: ${(props) =>
    props.children === "Yes" ? "pink" : "lightblue"};
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 10px;
  z-index: 20;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.children === "Yes" ? "#ff9ff3" : "#3498db"};
  }
`;
