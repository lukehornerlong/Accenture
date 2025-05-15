import React, { useState } from "react";
import Links from "../Links/Links";
import { StyledBackground, StyledSidebar } from "./sidebar.styled";
import ToggleButton from "../togglebutton/togglebutton";

const Sidebar = () => {
  const [open, setopen] = useState(false);
  const variants = {
    open: {
      clipPath: "circle(1200px at 50px 50px)",
      transition: { type: "spring", stiffness: 20 },
    },
    closed: {
      clipPath: "circle(30px at 50px 50px)",
      transition: {
        delay: 0.3,
        type: "Inertia",
      },
    },
  };

  return (
    <StyledSidebar animate={open ? "open" : "closed"}>
      <StyledBackground variants={variants}>
        <Links setopen={setopen} />
      </StyledBackground>
      <ToggleButton setOpen={setopen} />
    </StyledSidebar>
  );
};
export default Sidebar;
