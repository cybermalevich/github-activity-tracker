import React, { useContext } from "react";
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

import useStyles from "./styles";
import theme from "../../theme/theme";
import Context from "../../context/Context";
import HeaderUserAvatar from "../../components/HeaderUserAvatar/HeaderUserAvatar";

interface IProps {
  children: any
}

const Layout: React.FC<IProps> = ({ children }: IProps) => {
  const classes = useStyles();
  const { isAuthorized } = useContext(Context);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Github Activity Tracker
            </Typography>
            {!isAuthorized && <Button color="inherit">Help</Button>}
            {isAuthorized && (
              <HeaderUserAvatar/>
            )}
          </Toolbar>
        </AppBar>
        <Container className={classes.container}>
          {children}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
