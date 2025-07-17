import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/utils/constants";
import { addUser } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { RootState } from "../store/appStore";
import { tokenManager } from "@/utils/tokenManager";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useSelector((appStore: RootState) => appStore.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          const urlParams = new URLSearchParams(window.location.search);
          const tokenFromUrl = urlParams.get("token");

          if (tokenFromUrl) {
            token = tokenFromUrl;
            tokenManager.setToken(tokenFromUrl);
          } else {
            navigate("/landing");
            return;
          }
        }

        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(addUser(res.data));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            error.response?.data?.message || "Failed to fetch user data"
          );
        }

        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        navigate("/landing");
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
