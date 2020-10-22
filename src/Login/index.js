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

const Login = (props) => {
    
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [, setAccessToken] = React.useState('');
    const [isLoginFailed, setIsLoginFailed] = React.useState(false);
    

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
        setAccessToken(result.idToken.jwtToken);
        setIsLoginFailed(false);
        props.onSuccess(result.idToken.jwtToken, username);
    };

    const onFailure = (error) => {
        setIsLoginFailed(true);
    }

    const userPool = new CognitoUserPool({
        UserPoolId: UserPoolId,
        ClientId: ClientId,
    });

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
                console.log("newPasswordRequired");
                console.log(userAttributes);
        
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
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onLogin}
                    >
                        Sign In
                    </Button>
                    </form>
                </div>
                { isLoginFailed ? <p>Invalid Credentials</p> : null }

                </Container>

            </div>
        );
}

export default Login;