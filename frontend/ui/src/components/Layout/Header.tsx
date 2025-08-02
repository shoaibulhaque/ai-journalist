import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 sm:px-6 lg:px-8">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-lg sm:text-xl font-bold">
          AI Journalist
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/generate" className="hover:text-primary">
              Generate Report
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-48 sm:w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/generate">Generate Report</Link>
            </li>
          </ul>
        </div>

        <div className="avatar placeholder ml-2">
          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
            <span className="text-xs">SC</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
