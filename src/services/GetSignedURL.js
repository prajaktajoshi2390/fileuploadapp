import axios from "axios";

const GetSignedURL = (event) => {
    return new Promise((resolve, reject) => {
        axios.get(event.urlMain, 
        {headers: {Authorization: event.accessToken}})
        .then(function (response) {
            resolve(response.data.fileUploadURL);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default GetSignedURL;