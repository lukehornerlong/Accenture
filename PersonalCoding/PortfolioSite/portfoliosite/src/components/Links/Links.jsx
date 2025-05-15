import React from "react";
import { motion } from "framer-motion";
import { StyledLinks } from "./Links.styled";
import PropTypes from "prop-types";
const variants = {
  open: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};
const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
  },
  closed: {
    y: 50,
    opacity: 0,
  },
};

const Links = ({ setopen }) => {
  const handleClick = () => {
    setopen(false); // Call setopen to close the Sidebar
  };
  const items = [
    { name: "Home", page: "Landing" },
    { name: "CV", page: "cv" },
    { name: "Projects", page: "projects" },
    { name: "Contact", page: "Landing" },
    { name: "Interests", page: "Interests" },
  ];

  return (
    <StyledLinks variants={variants}>
      {items.map((item) => (
        <motion.a
          href={item.page === "Landing" ? `/${item.name}` : `/#/${item.name}`}
          key={item.name}
          variants={itemVariants}
          whileHover={{ scale: 1.1 }}
          onClick={handleClick}
        >
          {item.name}
        </motion.a>
      ))}
    </StyledLinks>
  );
};
Links.propTypes = {
  setopen: PropTypes.func.isRequired,
};
export default Links;
