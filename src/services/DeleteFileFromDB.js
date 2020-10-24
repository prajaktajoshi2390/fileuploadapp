import axios from "axios";

const DeleteFileFromDB = (event) => {
    return new Promise((resolve, reject) => {
        axios.put("https://v8rqpxbfs3.execute-api.us-east-2.amazonaws.com/Dev", {id: event.fileId},
          {headers: {Authorization: event.accessToken}})
        .then(function (response) {
            resolve(true);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default DeleteFileFromDB;