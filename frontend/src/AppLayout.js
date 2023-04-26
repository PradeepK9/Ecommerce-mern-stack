
import { useEffect } from 'react';
import './AppLayout.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import { Outlet, createBrowserRouter } from "react-router-dom";
import WebFont from "webfontloader";
import { Provider } from 'react-redux';
import store from './store';

function AppLayout() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <Provider store={store}>
      <Header />
      <Outlet />
      <Footer />
    </Provider>
  );
}

const appRouter = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <Home />
        }
      ]
    }
  ]
)

export default appRouter;
