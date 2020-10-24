import axios from "axios";

const DownloadFile = (event) => {
    return new Promise((resolve, reject) => {
        axios.put('https://ug1bk5i0i1.execute-api.us-east-2.amazonaws.com/Dev',
        {filename: event.file},
        {headers: {Authorization: event.accessToken}})
        .then(function (response) {
            resolve(response.data);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default DownloadFile;