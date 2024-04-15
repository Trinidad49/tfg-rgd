import React from "react";
import { Route, redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn ? <Component {...props} /> : redirect("/login")
    }
  />
);
