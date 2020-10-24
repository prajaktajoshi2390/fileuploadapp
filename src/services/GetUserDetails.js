import axios from "axios";

const GetUserDetails = (event) => {
    return new Promise((resolve, reject) => {
        axios.put("https://6yodq3t2a1.execute-api.us-east-2.amazonaws.com/Dev", {
            username: event.username
        })
        .then(function (response) {
            const firstname = response.data[0].firstname.S ? response.data[0].firstname.S : '';
            const lastname = response.data[0].lastname.S ? response.data[0].lastname.S : ''
            resolve({firstname, lastname});
        })
        .catch(function (error) {
            reject(error);
        });
    });
}
export default GetUserDetails;