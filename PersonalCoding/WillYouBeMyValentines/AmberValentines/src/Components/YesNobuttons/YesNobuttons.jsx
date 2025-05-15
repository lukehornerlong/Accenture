import {
  YesNoButton,
  YesNoButtonContainer,
  YesNoContainer,
  YesNoText,
} from "./YesNobuttons.styled";
import { useState } from "react";
const YesNobuttons = () => {
  const [buttonPosition, setButtonPosition] = useState({ x: "50%", y: "50%" });
  const [buttonClicked, setButtonClicked] = useState(false);
  const openLink = () => {
    // URL to open
    const url =
      "https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdrive.google.com%2Ffile%2Fd%2F1XWOuZPMcVkUEyy6R29Ax_a47NbBtm7sZ%2Fview%3Fusp%3Dsharing&data=05%7C02%7Clukehorner-long%40hastingsdirect.com%7Cb8349d6ca8454fa7237108dc26441549%7Cfd0683f5fc9b4266890da78350a8fe3d%7C0%7C0%7C638427321053904327%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C0%7C%7C%7C&sdata=6gmCDyT%2FEBn1yaiYIzLoDAZrl6Yixq2rLeUBdhLuw%2Bw%3D&reserved=0";

    // Open the URL in a new tab
    window.open(url, "_blank");
  };
  const handleNOclick = () => {
    const newX = Math.floor(Math.random() * 90) + 5 + "%"; // Randomize x position between 5% and 95%
    const newY = Math.floor(Math.random() * 90) + 5 + "%"; // Randomize y position between 5% and 95%
    setButtonPosition({ x: newX, y: newY });
    setButtonClicked(true);
  };
  return (
    <YesNoContainer>
      <YesNoButtonContainer>
        <YesNoButton onClick={openLink}>Yes</YesNoButton>
        <YesNoButton
          onClick={handleNOclick}
          style={{
            position: buttonClicked ? "absolute" : "static",
            top: buttonPosition.y,
            left: buttonPosition.x,
          }}
        >
          No
        </YesNoButton>
      </YesNoButtonContainer>
    </YesNoContainer>
  );
};

export default YesNobuttons;
