import Auth from "./pages/Auth";
import Body from "./components/Body";
import Feed from "./pages/Feed";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore";
import Requests from "./pages/Requests";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/requests" element={<Requests />} />
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
