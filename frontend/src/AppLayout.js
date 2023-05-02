
import { useEffect } from 'react';
import './AppLayout.css';
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import { Outlet, createBrowserRouter } from "react-router-dom";
import WebFont from "webfontloader";
import { Provider } from 'react-redux';
import store from './store';
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import ProductDetails from "./component/Product/ProductDetails.js";

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
};

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
      <AlertProvider template={AlertTemplate} {...options}>
        <Header />
        <Outlet />
        <Footer />
      </AlertProvider>
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
        },
        {
          path: '/product/:id',
          element: <ProductDetails />
        }
      ]
    }
  ]
)

export default appRouter;
