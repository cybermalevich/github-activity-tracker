import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    background: "url(https://images.unsplash.com/photo-1500993855538-c6a99f437aa7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  container: {
    height: "100%"
  },
  large: {
    cursor: "pointer",
    marginRight: theme.spacing(5)
  }
}));

export default useStyles;