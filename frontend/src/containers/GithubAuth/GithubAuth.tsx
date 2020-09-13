import React, { useContext, useEffect, useState } from "react";
import { Fab, Typography } from "@material-ui/core";
import { Github as GithubIcon } from "@icons-pack/react-simple-icons";
import { Paper, Grid } from "@material-ui/core";

import useStyles from "./styles";
import { useHistory, useLocation } from "react-router";
import useFetchData from "../../utils/hooks/useFetchData";
import { useCookies } from "react-cookie";
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
  const history = useHistory();
  const location = useLocation();
  const [cookies, setCookie] = useCookies();
  const searchParams = new URLSearchParams(location.search);
  const authCode = searchParams.get("code");
  const classes = useStyles();
  const emodjiStr = String.fromCodePoint(128578);
  const greeting = `Hi! ${emodjiStr}`;
  const [{ data, isLoading, isError }, setConfig] = useFetchData<IReceivedData>({
    method: "GET",
    params: {
      code: authCode
    },
    url: afterAuthApiUrl
  });

  useEffect(function checkAuthData() {
    if (data) {
      const { access_token: accessToken } = data;
      handleSettingLoading(true);
      handleSettingAccessToken(accessToken);
      setCookie("access_token", accessToken);
      setUserAuth(true);
      history.replace("/reps");
    }
  });

  return (
    <Grid
      className={classes.root}
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      {isError && <Typography variant="h5">The authorization error has occurred</Typography>}
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
