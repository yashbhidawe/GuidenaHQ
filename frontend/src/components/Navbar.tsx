import { BASE_URL } from "@/utils/constants";
import axios from "axios";

const Navbar = () => {
  const handleLogout = async () => {
    await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    localStorage.removeItem("loggedInUser");
    window.location.href = "/";
  };
  return (
    <div>
      <nav>
        <ul className="flex justify-between bg-gray-800 p-4 text-white">
          <li className="text-lg font-bold">GuidenaHQ</li>
          <li className="hover:text-gray-400">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-gray-400">
            <a href="/requests">requests</a>
          </li>
          <li className="hover:text-gray-400">
            <a href="/profile/edit">Edit</a>
          </li>
          <li className="hover:text-gray-400">
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
