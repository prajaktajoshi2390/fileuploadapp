import axios from "axios";

const GetUserFileList = (event) => {
    return new Promise((resolve, reject) => {
        axios.put("https://8m3i32xwsj.execute-api.us-east-2.amazonaws.com/Dev", {username: event.username},
          {headers: {Authorization: event.accessToken}})
      .then(function (response) {
        const fileList = [];
        if (response.data.length > 0) {
          response.data.forEach(function(element) {
            fileList.push({
              id: element.id.N,
              username: element.username.S,
              fileUpdatedTime: element.fileUpdatedTime.S,
              fileUploadedTime: element.fileUploadedTime.S,
              fileDescription: element.fileDescription.S,
              firstname: element.firstname ? element.firstname.S : '',
              lastname: element.lastname ? element.lastname.S : ''
            });
          });
          resolve({fileList});
        }
      })
      .catch(function (error) {
        reject(error);
      });
    });
}
export default GetUserFileList;