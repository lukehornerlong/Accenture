import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import GlobalStyle from "./components/globalstyle/globalstyle";
const Root = () => {
  return (
    <div id="page-root">
      <GlobalStyle />
      <Outlet />
    </div>
  );
};

export default Root;
