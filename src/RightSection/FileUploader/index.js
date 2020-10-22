import React from 'react';
import {useDropzone} from 'react-dropzone';
import axios from "axios";

const FileUploader = (props) => {

    const onDrop = (files) => {
        if (files[0].size > 10000000) {
            alert('File size > 10MB is not allowed');
        }
        const fileKey = files[0].name;
        const urlMain = "https://zf1jtpxmd0.execute-api.us-east-2.amazonaws.com/Dev?fileName=" + 
        files[0].name + "&fileType=" + files[0].type + "&fileKey=" + fileKey;
        axios.get(urlMain, {headers: {Authorization: props.accessToken}}).then((response) => {
            // Getting the url from response
            const url = response.data.fileUploadURL;
   
            // Initiating the PUT request to upload file    
            axios({
                method: "PUT",
                url: url,
                data: files[0],
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then(res => {
                    // axios({
                    //     method: "POST",
                    //     url: '/fileUpload',
                    //     // url:'https://t9tyn8rv07.execute-api.us-east-2.amazonaws.com/Dev',
                    //     data: {
                    //         username: props.username,
                    //         fileUploadedTime: new Date().toString(),
                    //         fileUpdatedTime: new Date().toString(),
                    //         fileDescription: files[0].name,
                    //         headers: {"Authorization": props.accessToken}
                    //       },
                    // })
                    axios.put("https://t9tyn8rv07.execute-api.us-east-2.amazonaws.com/Dev", {
                                username: props.username,
                                fileUploadedTime: new Date().toString(),
                                fileUpdatedTime: new Date().toString(),
                                fileDescription: files[0].name
                              },
                        {headers: {Authorization: props.accessToken}})
                       .then(function (response) {
                        console.log('response----', response);
                        alert('File Uploadeded successfully');
                      })
                      .catch(function (error) {
                        console.log(error);
                        alert('File Uploadeded successfully but entry is not added to database');
                      });
                })
                .catch(err => {
                    alert('Error');
                });
        });
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
        return (
            <div>
                <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
        </div>
        );
}

export default FileUploader;