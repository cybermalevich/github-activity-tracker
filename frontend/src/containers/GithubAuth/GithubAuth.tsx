import React from "react";
import { Fab, Typography } from "@material-ui/core";
import { Github as GithubIcon } from "@icons-pack/react-simple-icons";
import { Paper, Grid } from "@material-ui/core";
import axios from 'axios';

import useStyles from "./styles";
import { useLocation } from "react-router";

const githubOauthUrl = process.env.REACT_APP_GITHUB_OAUTH_URL;
const afterAuthApiEndpoint = process.env.REACT_APP_API_AFTER_AUTH;

const GithubAuth: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  console.log(searchParams.get('code'));
  const authCode = searchParams.get("code");
  const classes = useStyles();
  const emodjiStr = String.fromCodePoint(128578);
  const greeting = `Hi! ${emodjiStr}`;

  if (authCode) {
    axios({
      method: "GET",
      params: {
        code: authCode
      },
      url: afterAuthApiEndpoint
    }).then(data => {
      console.log(data);
    });
  }

  // console.log(data, isLoading, isError);

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={6} md={3}>
        <Paper className={classes.paper} elevation={2}>
          <div className={classes.content}>
            <Typography className={classes.heading} variant="h5" align="center">{greeting}</Typography>
            <Typography className={classes.heading} variant="body1">To watch your activity on GitHub all you
              need is to authorize by GitHub</Typography>
          </div>
          <Fab
            variant="extended"
            size="medium"
            color="secondary"
            aria-label="authorize-by-github"
            href={githubOauthUrl}
          >
            <GithubIcon className={classes.icon}/>
            Authorize by GitHub
          </Fab>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GithubAuth;