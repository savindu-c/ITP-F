import React, { useState } from "react";
import SideBarMenu from "../../components/Globle/SideBarMenu";
import Header from "../../components/Globle/Header";
import "../../styles/pages/HomePageStyles.css";
import { MdMenu } from "react-icons/md";
import TenderContent from "../components/TenderContent";

function TenderDashboard() {
  const [showMenu, setShowMenu] = useState(true);
  const profile = localStorage.getItem("profile");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("profile");
  };

  return (
    <div className="Home">
      <div className="header">
        <div className="menu-toggle" onClick={toggleMenu}>
          <MdMenu />
          <span>Menu</span>
        </div>
      </div>

      {showMenu && <SideBarMenu />}
      <div className="main">
        <Header profile={profile} fun={handleLogout} />

        <TenderContent />
      </div>
    </div>
  );
}

export default TenderDashboard;
