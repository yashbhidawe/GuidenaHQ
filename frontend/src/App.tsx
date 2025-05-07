import Auth from "./components/Auth";
import Body from "./components/Body";
import Feed from "./components/Feed";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import { Provider } from "react-redux";
import { appStore } from "./store/appStore";

const AppRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="/auth" element={<Auth />} />
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
