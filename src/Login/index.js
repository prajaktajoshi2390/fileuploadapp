import React from 'react';
import Button from '@material-ui/core/Button';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import SignUp from '../services/SignUp';
import GetUserDetails from '../services/GetUserDetails';

const Login = (props) => {
    
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstname, setFirstname] = React.useState('');
    const [lastname, setLastname] = React.useState('');
    const [, setAccessToken] = React.useState('');
    const [isLoginFailed, setIsLoginFailed] = React.useState(false);
    const [isSignUpFailed, setIsSignupFailed] = React.useState(false);
    const [displayLogin, setDisplayLogin] = React.useState(false);
    

    const UserPoolId = 'us-east-2_kXxKhhmfs';
    const ClientId = '1e67eu8mqp1c51rvgb7qaoq5j9';

    const useStyles = makeStyles((theme) => ({
        paper: {
          marginTop: theme.spacing(8),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        avatar: {
          margin: theme.spacing(1),
          backgroundColor: theme.palette.secondary.main,
        },
        form: {
          width: '100%', // Fix IE 11 issue.
          marginTop: theme.spacing(1),
        },
        submit: {
          margin: theme.spacing(3, 0, 2),
        },
      }));

    const onSuccess = (result) => {
        const token = result.idToken.jwtToken;
        GetUserDetails({username}).then(function (response) {
            setAccessToken(token);
            setIsLoginFailed(false);
            props.onSuccess(token, username, response.firstname, response.lastname);
        })
        .catch(function (error) {
            props.onSuccess(token, username, '', '');
        });
    };

    const onFailure = (error) => {
        setIsLoginFailed(true);
    }

    const userPool = new CognitoUserPool({
        UserPoolId: UserPoolId,
        ClientId: ClientId,
    });
    const onSignUp = () => {
        SignUp({username, firstname, lastname, password}).then(function (response) {
            setDisplayLogin(true);
        })
        .catch(function (error) {
            setIsSignupFailed(true);
        });
    }
    const onLogin = () => {   
        let cognitoUser = new CognitoUser({
            Username: username,
            Pool: userPool,
        });
        const authenticationDetails = new AuthenticationDetails({
            Username: username,
            Password: password,
        });
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure,
            newPasswordRequired: (userAttributes, requiredAttributes) => {
                // not interesting for this demo - add a bogus e-mail and append an X to the initial password
                userAttributes['email'] = 'test@abc.com';
                cognitoUser.completeNewPasswordChallenge(password + 'X', userAttributes, this);
            },
        });
    }
    const classes = useStyles();
        return (
            <div>            
                <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        { !displayLogin ? <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="First Name"
                                    autoFocus
                                    onChange={(event) => setFirstname(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    onChange={(event) => setLastname(event.target.value)}
                                />
                            </Grid>
                        </Grid> : null}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            autoFocus
                            onChange={(event) => setUsername(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        { displayLogin ? <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onLogin}
                        >
                            Sign In
                        </Button> :
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onSignUp}
                        >
                            Sign Up
                        </Button>}
                        { !displayLogin ? <Grid container justify="flex-end">
                            <Grid item>
                            <Link variant="body2" onClick={() => {setDisplayLogin(true)}}>
                                Already have an account? Sign in
                            </Link>
                            </Grid>
                        </Grid> : null }
                    </form>
                </div>
                { isLoginFailed ? <p>Invalid Credentials</p> : null }
                { isSignUpFailed ? <p>Invalid Entry. Not able to sign up.</p> : null }
                </Container>
            </div>
        );
}

export default Login;