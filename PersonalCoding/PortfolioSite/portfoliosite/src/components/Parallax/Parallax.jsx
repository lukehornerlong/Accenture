import { useRef } from "react";
import {
  StyledAboutmePics,
  StyledContactmePics,
  StyledH1,
  StyledParallax,
  StyledSquiggles,
} from "./Parallax.styled";
import { useScroll, useTransform } from "framer-motion";

const Parallax = ({ type }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "500%"]);
  const yscaler = useTransform(scrollYProgress, [1, 0], ["0%", "100%"]);

  return (
    <StyledParallax
      ref={ref}
      style={{
        background:
          type === "aboutme"
            ? "linear-gradient(180deg, #005046, #8cbdb0)"
            : "linear-gradient(180deg,#8cbdb0, #005046)",
      }}
    >
      <StyledH1 style={{ y: yText }}>
        {type === "aboutme" ? "Who am I?" : "How to get in touch?"}
      </StyledH1>
      <StyledSquiggles />
      <>
        {type === "aboutme" ? (
          <StyledAboutmePics style={{ scale: yscaler }} />
        ) : (
          <StyledContactmePics style={{ scale: yscaler }} />
        )}
      </>
    </StyledParallax>
  );
};
export default Parallax;
