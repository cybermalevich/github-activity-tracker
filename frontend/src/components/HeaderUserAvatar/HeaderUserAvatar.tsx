import React, { useContext } from "react";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import Context from "../../context/Context";
import useStyles from "./styles";

const HeaderUserAvatar: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const { userData, handleLogout } = useContext(Context);

  const handleClick = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    handleLogout();
  };

  return (
    <>
      {userData && (
        <>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
          <Avatar onClick={handleClick} alt={userData.name} src={userData?.avatar_url} className={classes.large}/>
        </>
      )}
    </>
  );
};

export default HeaderUserAvatar;
