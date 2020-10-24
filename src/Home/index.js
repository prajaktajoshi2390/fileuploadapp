import React, { useEffect } from "react";
import { Router, Route, Link } from "react-router-dom";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import HeaderContainer from '../HeaderContainer';
import FileList from '../RightSection/FileList';
import FileUploader from '../RightSection/FileUploader';
import Login from '../Login';
import history from '../history';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));


const Home = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isAuthed, setIsAuthed] = React.useState(false);
  const [accessToken, setAccessToken] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [firstname, setFirstname] = React.useState('');
  const [lastname, setLastname] = React.useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (accessToken !== '') {
      setIsAuthed(true);
      history.push('list');
      setOpen(true);
    }
  }, [accessToken]);

  const setLoginDetails = (token, username, firstname, lastname) => {
    setAccessToken(token);
    setUsername(username);
    setFirstname(firstname);
    setLastname(lastname);
  }
  return (
    <Router history={history}>
    <div className={classes.root}>
      <HeaderContainer open={open} classes={classes} handleDrawerOpen={handleDrawerOpen} isAuthed={isAuthed} username={username}/>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/list" >
              <ListItemIcon>
                <FileCopyIcon />
              </ListItemIcon>
            <ListItemText>My Files</ListItemText>
          </ListItem>
          { username !== 'admin' ? <ListItem button component={Link} to="/upload" >
              <ListItemIcon>
                <CloudUploadIcon />
              </ListItemIcon>
            <ListItemText>Upload File</ListItemText>
          </ListItem> : null }
        </List>
        <Divider />
      </Drawer>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Route exact path="/" component={() => <Login onSuccess={(token, username, firstname, lastname) => setLoginDetails(token, username, firstname, lastname)} />} />
        <Route path="/list" component={() => <FileList accessToken={accessToken} username={username}/>} />
        <Route path="/upload" component={() => <FileUploader accessToken={accessToken} username={username} firstname={firstname} lastname={lastname}/>} />
      </div>
    </div>
    </Router>
  );
}

export default Home;