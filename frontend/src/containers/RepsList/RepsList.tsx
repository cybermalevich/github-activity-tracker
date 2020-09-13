import React, { useContext, useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import useStyles from "./styles";
import { Link } from "react-router-dom";

import { IRep } from "../../utils/interfaces/rep";
import Context from "../../context/Context";

function getRepItemsList(reps: IRep[]) {
  return reps.map(({ id, name }) => {
    const url = `/reps/${id}`;

    return (
      <ListItem key={id}>
        <ListItemIcon>
          <FolderIcon/>
        </ListItemIcon>
        <Link to={url}>{name}</Link>
      </ListItem>);
  });
}

const RepsList: React.FC = () => {
  const classes = useStyles();
  const data = useContext(Context);

  return (<>
    {!data.userData ? <Typography variant="h1">Loading...</Typography> : (
      <Grid item xs={12} className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6">
            Repositories with my activity:
          </Typography>
          <div>
            <List>
              {data && data.userData && getRepItemsList(data?.userData.reps)}
            </List>
          </div>
        </Paper>
      </Grid>
    )}
  </>);
};

export default RepsList;