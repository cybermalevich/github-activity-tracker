import React from "react";
import { AppBar, Button, Container, CssBaseline, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

import useStyles from "./styles";
import theme from "../../theme/theme";

interface IProps {
  children: React.ReactChild
}

const Layout: React.FC<IProps> = ({ children }) => {
  const classes = useStyles();

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
            <Button color="inherit">Help</Button>
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