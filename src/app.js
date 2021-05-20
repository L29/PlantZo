import React, { useEffect } from "react";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import UserPage from "./pages/UserPage";
import ItemPage from "./pages/ItemPage";
import TestPage from "./pages/TestPage";
import CheckoutPage from "./pages/CheckoutPage";
import UnPaidPage from "./pages/UnPaidPage";
import InPaidPage from "./pages/InPaidPage";
import PaymentStatePage from "./pages/PaymentStatePage";

import NavHome from "./components/NavHome";
import PageContainer from "./components/PageContainer";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import { auth } from "./lib/firebase/firebase.utils";
import { selectCurrentUser } from "./redux/user/user.selectors";

const App = () => {
  const currentUser = useSelector((state) => selectCurrentUser(state));

  const location = useLocation();

  let unsubscribeFromAuth = null;

  useEffect(() => {
    unsubscribeFromAuth = auth.onAuthStateChanged(
      (user) => console.log("USER_TO_FIREBASE_OFF")
      // dispatch(setCurrentUser(user))
    );

    return () => {
      unsubscribeFromAuth();
    };
  }, []);

  console.log(currentUser);

  return (
    <PageContainer>
      {location.pathname === "/" ? <NavHome /> : <Nav />}
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/shop"
          render={() => (!currentUser ? <Redirect to="/" /> : <ShopPage />)}
        />
        <Route
          exact
          path="/shop/:itemId"
          render={() => (!currentUser ? <Redirect to="/" /> : <ItemPage />)}
        />
        <Route
          exact
          path="/cart"
          render={() => (!currentUser ? <Redirect to="/" /> : <CartPage />)}
        />
        <Route
          exact
          path="/checkout"
          render={() => (!currentUser ? <Redirect to="/" /> : <CheckoutPage />)}
        />
        <Route
          exact
          path="/unpaid"
          render={() => (!currentUser ? <Redirect to="/" /> : <UnPaidPage />)}
        />
        <Route
          exact
          path="/inpaid"
          render={() => (!currentUser ? <Redirect to="/" /> : <InPaidPage />)}
        />
        <Route
          exact
          path="/user"
          render={() => (!currentUser ? <Redirect to="/" /> : <UserPage />)}
        />
        <Route
          path="/state"
          render={() =>
            !currentUser ? <Redirect to="/" /> : <PaymentStatePage />
          }
        />
        <Route exact path="/test" component={TestPage} />
      </Switch>
      <Footer />
    </PageContainer>
  );
};

export default withRouter(App);
