import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { addUser } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { RootState } from "../store/appStore";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const location = useLocation();

  const userData = useSelector((appStore: RootState) => appStore.user);

  const fetchUser = async () => {
    try {
      if (userData) return;

      const res = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(addUser(res.data));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching user data!");
      // if (location.pathname !== "/landing") {
      //   navigate("/landing");
      // } else {
      navigate("/auth");
      // }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
