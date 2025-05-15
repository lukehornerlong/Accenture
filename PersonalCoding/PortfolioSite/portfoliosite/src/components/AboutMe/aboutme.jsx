import { useSpring, useScroll, useTransform } from "framer-motion";
import StyledSection from "../StyledSection/StyledSection";
import { useRef } from "react";
import {
  StyledAboutMeContainer,
  StyledAboutMeTextcontainer,
  StyledAboutMeWrapper,
  StyledAboutMeimgcontainer,
  StyledProgress,
  StyledProgressBar,
  Styledaboutme,
  StyledaboutmeButton,
  StyledaboutmeH2,
  StyledaboutmeP,
} from "./aboutme.styled";
const items = [
  {
    id: 1,
    title: "Who Am I?",
    img: "https://images.pexels.com/photos/18073372/pexels-photo-18073372/free-photo-of-young-man-sitting-in-a-car-on-a-night-street.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    desc: "My name is Luke. I am a British South-African Living in Surrey. I am currently completing my placment year with Hastings Direct as a ✨Front End Developer✨, as part of my Computer Science degree at the University of Birmingham",
    buttontext: "",
    buttonvisible: false,
    buttondestination: "",
  },
  {
    id: 2,
    title: "What do I do?",
    img: "https://images.pexels.com/photos/18023772/pexels-photo-18023772/free-photo-of-close-up-of-a-person-holding-a-wristwatch.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ab id ad nesciunt quo aut corporis modi? Voluptate, quos sunt dolorum facilis, id eum sequi placeat accusantium saepe eos laborum.",
    buttontext: "See my CV",
    buttonvisible: true,
    buttondestination: "CV",
  },
  {
    id: 3,
    title: "Where do I study?",
    img: "https://images.pexels.com/photos/6894528/pexels-photo-6894528.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ab id ad nesciunt quo aut corporis modi? Voluptate, quos sunt dolorum facilis, id eum sequi placeat accusantium saepe eos laborum.",
    buttontext: "See my CV",
    buttonvisible: false,
    buttondestination: "",
  },
  {
    id: 4,
    title: "What are my Interests",
    img: "https://images.pexels.com/photos/18540208/pexels-photo-18540208/free-photo-of-wood-landscape-water-hill.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ab id ad nesciunt quo aut corporis modi? Voluptate, quos sunt dolorum facilis, id eum sequi placeat accusantium saepe eos laborum.",
    buttontext: "Find out more",
    buttonvisible: true,
    linkadress: "",
    buttondestination: "Interests",
  },
];
const Single = ({ item }) => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({
    target: ref,
  });
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [200, 100, 0, 100, 200]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <StyledSection>
      <StyledAboutMeContainer>
        <StyledAboutMeWrapper>
          <StyledAboutMeimgcontainer ref={ref} style={{ opacity }}>
            <img src={item.img} alt="" />
          </StyledAboutMeimgcontainer>
          <StyledAboutMeTextcontainer style={{ translateX, opacity }}>
            <StyledaboutmeH2>{item.title}</StyledaboutmeH2>
            <StyledaboutmeP>{item.desc}</StyledaboutmeP>
            {item.buttonvisible === true ? (
              <StyledaboutmeButton
                href={`${window.location.origin}/#/${item.buttondestination}`}
              >
                <h1>{item.buttontext}</h1>
              </StyledaboutmeButton>
            ) : (
              <></>
            )}
          </StyledAboutMeTextcontainer>
        </StyledAboutMeWrapper>
      </StyledAboutMeContainer>
    </StyledSection>
  );
};

const AboutMe = () => {
  const ref = useRef();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <Styledaboutme
      style={{
        background: "linear-gradient(180deg,#8cbdb0 , #8cbdb0)",
      }}
    >
      <StyledProgress>
        <h1>About Me</h1>
        <StyledProgressBar style={{ scaleX }}></StyledProgressBar>
      </StyledProgress>
      {items.map((item) => (
        <Single item={item} key={item.id} />
      ))}
    </Styledaboutme>
  );
};

export default AboutMe;
