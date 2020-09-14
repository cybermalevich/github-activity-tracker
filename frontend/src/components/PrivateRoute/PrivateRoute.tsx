import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";

import Context from "../../context/Context";

interface IProps extends RouteProps{
  children: React.ReactNode;
}

export default function PrivateRoute({ children, ...rest}: IProps) {
  const { isAuthorized } = useContext(Context);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthorized ? (
          children
        ) : (
          <Redirect
            to="/auth"
          />
        )
      }
    />
  );
}
