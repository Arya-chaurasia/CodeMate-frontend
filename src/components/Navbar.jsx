import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar bg-base-300/90 shadow-md h-20 px-6 backdrop-blur-sm">
      <div className="flex-1 max-w-screen-xl mx-auto">
        <Link to="/" className="btn btn-ghost text-2xl font-bold tracking-wide transition hover:text-primary">
          Dev Tinder
        </Link>
      </div>
      {user && (
        <div className="flex items-center gap-4 px-2">
          <p className="text-sm md:text-base font-medium text-gray-700">
            Welcome, <span className="text-primary">{user.firstName}</span>
          </p>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
             className="btn btn-ghost btn-circle avatar border-2 border-primary/50"
            >
              <div className="w-12 rounded-full overflow-hidden">
                <img alt="Profile" src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56"
            >
              <li>
                <Link to="/profile"  className="justify-between hover:bg-primary/20 transition">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/connections"  className="hover:bg-primary/20 transition">Connections</Link>
              </li>
              <li>
                <Link to="/requests" className="hover:bg-primary/20 transition">Requests</Link>
              </li>
               <li>
                <Link to="/premium" className="hover:bg-primary/20 transition">Premium</Link>
              </li>
              <li>
                <a onClick={handleLogout} className="hover:bg-error/20 transition cursor-pointer">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
