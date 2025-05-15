import { Flower } from "./FlowerBackground.styled";
import { useState, useEffect } from "react";
const FlowerPage = () => {
  const getRandomColor = () => {
    const colors = ["#ff6b6b", "#48dbfb", "#1dd1a1", "#feca57", "#5f27cd"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRandomSize = () => Math.floor(Math.random() * 40) + 10; // Random size between 10px and 50px

  const getRandomPosition = () => ({
    top: Math.random() * window.innerHeight,
    left: Math.random() * window.innerWidth,
  });

  const [flowers, setFlowers] = useState([]);
  const [flowerIndex, setFlowerIndex] = useState(0);

  // Generate flowers one at a time when the component mounts
  useEffect(() => {
    if (flowerIndex < 100) {
      // Generate 100 flowers
      const newFlower = {
        color: getRandomColor(),
        size: getRandomSize(),
        position: getRandomPosition(),
        show: true, // Initially show the flower
      };
      setFlowers((prevFlowers) => [...prevFlowers, newFlower]);
      setFlowerIndex((prevIndex) => prevIndex + 1);
    }
  }, [flowerIndex]); // Trigger effect when flowerIndex changes

  return (
    <div>
      {flowers.map((flower, index) => (
        <Flower
          key={index}
          position={flower.position}
          size={flower.size}
          show={flower.show}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.5 40C20.5 40 10.5 25 20.5 10C15 12.5 5 20 9 30C13.5 40 20.5 35 20.5 35C20.5 35 27.5 40 32 30C36.5 20 26.5 12.5 21.5 10C31.5 25 20.5 40 20.5 40Z"
            fill={flower.color}
          />
        </Flower>
      ))}
    </div>
  );
};

export default FlowerPage;
