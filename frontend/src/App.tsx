import Auth from "./pages/Auth";
import Body from "./components/Body";
import Feed from "./pages/Feed";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Chat from "./pages/Chat";
import Meet from "./pages/Meet";
import Meetings from "./pages/Meetings";
import Mentorships from "./pages/Mentorships";
import NotFound from "./pages/NotFound";
import GuidenaAI from "./pages/GuidenaAI";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile/:userID" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/chat/:receiverId" element={<Chat />} />
          <Route path="/meet/:receiverId" element={<Meet />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/mentorships" element={<Mentorships />} />
          <Route path="/guidena-ai" element={<GuidenaAI />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        limit={3}
      />
    </BrowserRouter>
  );
};
const App = () => {
  return (
    <Provider store={appStore}>
      <AppRouters />
    </Provider>
  );
};

export default App;
