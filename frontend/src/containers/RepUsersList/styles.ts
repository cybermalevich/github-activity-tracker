import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(24)
  },
  paper: {
    padding: theme.spacing(5)
  },
  heading__rep: {
    textTransform: "uppercase",
    fontWeight: theme.typography.fontWeightBold
  }
}));

export default useStyles;