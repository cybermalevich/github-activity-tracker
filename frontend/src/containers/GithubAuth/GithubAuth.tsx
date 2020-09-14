import React, { useContext, useEffect } from "react";
import axios from "axios";
import { Fab, Typography } from "@material-ui/core";
import { Github as GithubIcon } from "@icons-pack/react-simple-icons";
import { Paper, Grid } from "@material-ui/core";

import useStyles from "./styles";
import { useLocation } from "react-router";
import Context from "../../context/Context";

const githubOauthUrl = process.env.REACT_APP_GITHUB_OAUTH_URL;
const afterAuthApiUrl = process.env.REACT_APP_API_AFTER_AUTH;

interface IReceivedData {
  access_token: string;
}

interface IProps {
  setUserAuth: (userAuthorized: boolean) => void;
}

const GithubAuth: React.FC<IProps> = ({ setUserAuth }: IProps) => {
  const { handleSettingAccessToken, handleSettingLoading } = useContext(Context);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const authCode = searchParams.get("code");
  const classes = useStyles();
  const emodjiStr = String.fromCodePoint(128578);
  const greeting = `Hi! ${emodjiStr}`;

  useEffect(function checkAuthData() {
    if (authCode) {
      axios({
        url: afterAuthApiUrl,
        params: {
          code: authCode
        }
      }).then(({ data }) => {
        handleSettingAccessToken(data.access_token);
      });
    }
  }, [authCode]);

  return (<>
      {authCode ? handleSettingLoading(true) : (
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
      )}
    </>
  );
};

export default GithubAuth;
