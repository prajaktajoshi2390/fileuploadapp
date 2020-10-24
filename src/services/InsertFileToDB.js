import axios from "axios";

const InsertFileToDB = (event) => {
    return new Promise((resolve, reject) => {
        axios.put("https://910pr0icab.execute-api.us-east-2.amazonaws.com/Dev", {
            username: event.username,
            fileUploadedTime: event.fileUploadedTime,
            fileUpdatedTime: event.fileUpdatedTime,
            fileDescription: event.fileDescription,
            firstname: event.firstname,
            lastname: event.lastname,
            id: event.id
          },
        {headers: {Authorization: event.accessToken}})
        .then(function (response) {
            resolve(true);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default InsertFileToDB;