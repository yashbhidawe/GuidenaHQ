import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userData) return;

        const res = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            error.response?.data?.message || "Failed to fetch user data"
          );
        }
        navigate("/auth");
      }
    };

    fetchUser();
  }, [dispatch, navigate, userData]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
