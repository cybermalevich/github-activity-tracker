import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";
import { CookiesProvider, useCookies } from "react-cookie";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Layout from "../Layout/Layout";
import GithubAuth from "../GithubAuth/GithubAuth";
import RepsList from "../RepsList/RepsList";
import RepUsersList from "../RepUsersList/RepUsersList";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute";
import Context from "../../context/Context";
import ActivityDiagramCard from "../ActivityDiagramCard/ActivityDiagramCard";
import { IUserData } from "../../utils/interfaces/user";

function App() {
  const [{ access_token: cookieAccessToken }, setCookie, removeCookie] = useCookies();
  const [isAuthorized, setUserAuth] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [accessToken, setAccessToken] = useState<null | string>(null);

  useEffect(function checkUserAuthorization() {
    async function fetchUsersWithReps(accessToken: string, cb: (data: IUserData) => void) {
      const { data } = await axios({
        url: process.env.REACT_APP_API_USER_WITH_REPS,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      cb(data);
    }

    if (isAuthorized) {
      fetchUsersWithReps(accessToken!, data => {
        setUserData(data);
      });

      setLoading(false);

      return;
    }

    if (!cookieAccessToken) {
      setLoading(false);
      return;
    }

    fetchUsersWithReps(cookieAccessToken, data => {
      if (data) {
        setUserAuth(true);
        setUserData(data);
      }

      setLoading(false);
    });
  }, [accessToken, cookieAccessToken, isAuthorized]);

  const handleLogout = () => {
    removeCookie("access_token");
    setUserAuth(false);
  };

  const handleSettingAccessToken = (accessToken: string) => {
    setAccessToken(accessToken);
  };

  return (
    <Context.Provider value={{ isAuthorized, userData, handleLogout, handleSettingAccessToken, handleSettingLoading: setLoading }}>
      <CookiesProvider>
        <Layout>
          {isLoading ? <Typography variant="h1">Loading...</Typography> : (
            <Router>
              <Switch>
                <PrivateRoute path="/" exact>
                  <RepsList/>
                </PrivateRoute>
                <Route path="/auth" render={() => {
                  return isAuthorized ? <Redirect to="/reps"/> : <GithubAuth setUserAuth={setUserAuth}/>;
                }}/>
                <PrivateRoute path="/reps" exact>
                  <RepsList/>
                </PrivateRoute>
                <PrivateRoute path="/reps/:id" exact>
                  <RepUsersList/>
                </PrivateRoute>
                <PrivateRoute path="/reps/:repId/user/:userId">
                  <ActivityDiagramCard/>
                </PrivateRoute>
                <Route>
                  <Typography variant="h1">Error 404</Typography>
                </Route>
              </Switch>
            </Router>
          )}
        </Layout>
      </CookiesProvider>
    </Context.Provider>
  );
}

export default App;
