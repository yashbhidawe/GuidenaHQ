const Navbar = () => {
  return (
    <div>
      <nav>
        <ul className="flex justify-between bg-gray-800 p-4 text-white">
          <li className="text-lg font-bold">MyApp</li>
          <li className="hover:text-gray-400">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-gray-400">
            <a href="/about">About</a>
          </li>
          <li className="hover:text-gray-400">
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
