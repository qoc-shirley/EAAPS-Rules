import React from 'react';
import logo from './img/logo.svg';
import './styles.css';

const Header = () => {
  return(
    <div className="header">
      <div className="header__logo">

        // declare arguments on individual lines and ABC order
        <img
          src={logo}
          className="header__logo" alt="logo"/>
      </div>
      <div className="header__heading">
        <h2>EAAPs Escalation Rules</h2>
      </div>
    </div>
  );
};

export default Header;
