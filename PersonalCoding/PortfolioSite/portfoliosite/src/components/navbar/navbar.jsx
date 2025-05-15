import React from "react";
import {
  Socialmediasholder,
  Stylednavbardiv,
  Styledwrapper,
} from "./navbar.styled";
import Sidebar from "../sidebar/sidebar";

import { animate, motion } from "framer-motion";
const Navbar = () => {
  return (
    <Stylednavbardiv>
      {/*sidebar*/}
      <Sidebar></Sidebar>
      <Styledwrapper>
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Luke Horner-Long
        </motion.span>
        <Socialmediasholder
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <a href="https://instagram.com">
            <img src="/instagram.png" alt="" />
          </a>
          <a href="https://facebook.com">
            <img src="/facebook.png" alt="" />
          </a>
          <a href="https://linkedin.com">
            <img src="/linkedin.png" alt="" />
          </a>
          <a href="https://spotify.com">
            <img src="/spotify.png" alt="" />
          </a>
        </Socialmediasholder>
      </Styledwrapper>
    </Stylednavbardiv>
  );
};
export default Navbar;
