import { fade, makeStyles } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100%",

    "& .MuiFab-extended.MuiFab-sizeMedium": {
      margin: 0,
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      borderRadius: 0,
      borderBottomRightRadius: theme.spacing(.5),
      borderBottomLeftRadius: theme.spacing(.5)
    }
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  paper: {
    position: "relative",
    backgroundColor: "rgb(17 29 99 / 75%)",
    padding: theme.spacing(4)
  },
  heading: {
    color: "white",
    textTransform: "uppercase",
  },
  content: {
    marginBottom: theme.spacing(4)
  }
}));

export default useStyles;