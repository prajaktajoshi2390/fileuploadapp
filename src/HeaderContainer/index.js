import * as React from 'react';
import clsx from "clsx";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const HeaderContainer = (props) => {
  return (
    <AppBar
        position="fixed"
        className={clsx(props.classes.appBar, {
        [props.classes.appBarShift]: props.open
        })}
    >
        <Toolbar>
        { props.isAuthed ? <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            edge="start"
            className={clsx(props.classes.menuButton, props.open && props.classes.hide)}
        >
            <MenuIcon />
        </IconButton> : null }
        <Typography variant="h6" noWrap>
            My File Manager
        </Typography>
        { props.username !== '' ? <div>Welcome {props.username}</div> : null }
        </Toolbar>
    </AppBar>
    );
};

export default HeaderContainer;
