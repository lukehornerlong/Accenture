import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  *{
    padding: 0;
    margin: 0;
    box-sizing:border-box;
    font-family:"DM sans", sans-serif;
  }

  a{
    text-decoration: none;
    color:inherit;
  }

  body{
    background-color:#005046;
    color:#FDFAE4;
  }
  
`;

export default GlobalStyle;
