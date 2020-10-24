import axios from "axios";

const InsertFileToS3 = (event) => {
    return new Promise((resolve, reject) => {
        axios({
            method: "PUT",
            url: event.url,
            data: event.fileData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
            resolve(true);
        })
        .catch(function (error) {
          reject(error)
        });
    });
}
export default InsertFileToS3;