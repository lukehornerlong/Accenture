import StyledSection from "../components/StyledSection/StyledSection";
import GlobalStyle from "../components/globalstyle/globalstyle";
import Homepage from "../components/homepage/Homepage";
import Parallax from "../components/Parallax/Parallax";
import AboutMe from "../components/AboutMe/aboutme";
import Contact from "../components/Contact/Contact";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Navbar from "../components/navbar/navbar";
const LandingPage = ({ sectionId }) => {
  const handleScroll = () => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    // Function to run when the web address changes
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    document.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", handleScroll);
    });

    // Remove event listeners when the component is unmounted or updated
    return () => {
      document.querySelectorAll("a").forEach((anchor) => {
        anchor.removeEventListener("click", handleScroll);
      });
    };
    // You can put your logic here that needs to run when the web address changes
  }, []);
  return (
    <div>
      <StyledSection id="home">
        <Navbar />
        <Homepage />
      </StyledSection>

      <StyledSection id="About">
        <Parallax type={"aboutme"} />
      </StyledSection>
      <AboutMe />
      <StyledSection id="Parlax2">
        <Parallax type={"howtogetintouch"} />
      </StyledSection>
      <StyledSection id="Contact">
        <Contact />
      </StyledSection>
    </div>
  );
};
LandingPage.propTypes = {
  sectionId: PropTypes.string.isrequired,
};
export default LandingPage;
