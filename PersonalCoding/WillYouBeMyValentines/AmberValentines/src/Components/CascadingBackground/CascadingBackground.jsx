import { Background, Heart } from "./CascadingBackground.styled";
const CascadingBackground = () => {
  const getRandomSize = () => Math.floor(Math.random() * 60) + 40; // Random size between 40px and 100px
  const getRandomColor = () => {
    const colors = ["#ff6b6b", "#48dbfb", "#0073ff", "#00278a", "#ff79e2"];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const hearts = Array.from({ length: 20 }).map((_, index) => ({
    size: getRandomSize(),
    position: Math.random() * 100,
    speed: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.2, // Random opacity between 0.2 and 0.8
    color: getRandomColor(),
  }));

  return (
    <Background>
      {hearts.map((heart, index) => (
        <Heart
          key={index}
          size={heart.size}
          position={heart.position}
          speed={heart.speed}
          delay={heart.delay}
          opacity={heart.opacity}
          color={heart.color}
        >
          &hearts;
        </Heart>
      ))}
    </Background>
  );
};

export default CascadingBackground;
