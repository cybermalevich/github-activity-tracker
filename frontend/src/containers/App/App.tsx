import React from "react";
import { Typography } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import GithubAuth from "../GithubAuth/GithubAuth";

function App() {
  return (
    <Layout>
      <Router>
        <Switch>
          <Route path="/" exact>
            <GithubAuth />
          </Route>
          <Route path="/reps/:id" exact>
            <Typography variant="h1">Users list</Typography>
          </Route>
          <Route path="/reps/:id/user/:id">
            <Typography variant="h1">User Activity</Typography>
          </Route>
        </Switch>
      </Router>
    </Layout>
  );
}

export default App;
