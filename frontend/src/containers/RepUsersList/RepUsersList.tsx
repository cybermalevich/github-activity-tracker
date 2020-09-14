import React  from "react";
import { Paper, Grid, Typography, List, ListItem, ListItemIcon } from "@material-ui/core";

import useStyles from "./styles";
import useFetchData from "../../utils/hooks/useFetchData";
import { useCookies } from "react-cookie";
import generateUrl from "../../utils/generateUrl";
import { useParams } from "react-router";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { Link } from "react-router-dom";
import { IUser } from "../../utils/interfaces/user";

const repUsersApiUrl = process.env.REACT_APP_API_REP_USERS!;

interface RepUsersDto {
  rep_name: string;
  users: IUser[];
}

function getRepUsersList(users: IUser[], repId: string) {
  return users.map(({ id: userId, name: userName }) => {
    const url = `/reps/${repId}/user/${userId}`;

    return (
      <ListItem key={userId}>
        <ListItemIcon>
          <AccountBoxIcon/>
        </ListItemIcon>
        <Link to={url}>{userName || userId}</Link>
      </ListItem>);
  });
}

const RepUsersList: React.FC = () => {
  const classes = useStyles();
  const { id: repId } = useParams();
  const [{ access_token: accessToken }] = useCookies(["access_token"]);
  const [{ data }] = useFetchData<RepUsersDto>({
    url: generateUrl(repUsersApiUrl, {
      ID: repId
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  let repName;

  if (data) {
    const repUsersData = data as RepUsersDto;
    repName = repUsersData.rep_name;
  }

  return (
    <>
      {data && (<Grid
        className={classes.root}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Paper className={classes.paper}>
          <Typography variant="h6">
            <span className={classes.heading__rep}>{repName}</span> users list:
          </Typography>
          <div>
            <List>
              {data && getRepUsersList(data.users, repId)}
            </List>
          </div>
        </Paper>
      </Grid>)}
    </>
  );
};

export default RepUsersList;
