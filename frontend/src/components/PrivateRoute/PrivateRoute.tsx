import React, { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useCookies } from "react-cookie";

import Context from "../../context/Context";
import Auth from "../../utils/services/Auth";
import context, { IContext } from "../../context/context";

interface IProps extends RouteProps{
  children: React.ReactNode;
}

export default function PrivateRoute({ children, ...rest}: IProps) {
  const [{ access_token: accessToken }] = useCookies();
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
