import axios from "axios";

const DeleteFileFromS3 = (event) => {
    return new Promise((resolve, reject) => {
        axios.put('https://h1wipggwz9.execute-api.us-east-2.amazonaws.com/Dev',
        {filename: event.file},
        {headers: {Authorization: event.accessToken}})
        .then(function (response) {
            resolve(true);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default DeleteFileFromS3;