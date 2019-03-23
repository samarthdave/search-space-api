import React from 'react';
import { NavLink } from 'react-router-dom';

import ghSVG from '../media/github.svg';

function MinimalNavbar() {
  return (
    <div className="minimal-navbar">
      <ul className="links">
        <NavLink
          exact
          to="/"
          className="nav-link"
        >
          Home
        </NavLink>
        <NavLink
          exact
          to="/search"
          className="nav-link"
        >
          Search
        </NavLink>
        <a href="https://github.com/samarthdave/search-space-api"
          className="nav-link"
        >
          <img
            src={ghSVG}
            id="gh-link"
            height="20" width="20"
            alt="Gitub"
          />
        </a>
      </ul>
    </div>
  );
}

export default MinimalNavbar;