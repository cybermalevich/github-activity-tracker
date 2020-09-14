import React from "react";
import {
  Grid,
  Typography
} from "@material-ui/core";

import useStyles from "./styles";

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" justify="center" className={classes.root}>
      <Grid item>
        <Typography variant="h1">Loading...</Typography>
      </Grid>
    </Grid>
  );
};

export default Loading;
