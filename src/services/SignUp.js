import axios from "axios";
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const SignUp = (event) => {
    const UserPoolId = 'us-east-2_kXxKhhmfs';
    const ClientId = '1e67eu8mqp1c51rvgb7qaoq5j9';
    const userPool = new CognitoUserPool({
        UserPoolId: UserPoolId,
        ClientId: ClientId,
    });

    let dataEmail = {
    Name : 'email',
    Value : 'test@abc.com'
    };
    let dataName = {
        Name : 'preferred_username',
        Value : event.username
    };	
    let attributeList = [ new CognitoUserAttribute(dataEmail),
    new CognitoUserAttribute(dataName) ];

    return new Promise((resolve, reject) => {
        userPool.signUp(event.username, event.password, attributeList, null, function(err, result){
            axios.put("https://b3pxyrpn99.execute-api.us-east-2.amazonaws.com/Dev", {
                    username: event.username,
                    firstname: event.firstname,
                    lastname: event.lastname
            })
            .then(function (response) {
                resolve(true);
            })
            .catch(function (error) {
                reject(error);
            });
        });
    });
}
export default SignUp;