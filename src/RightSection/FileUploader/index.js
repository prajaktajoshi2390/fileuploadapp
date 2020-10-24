import React, {useEffect} from 'react';
import {useDropzone} from 'react-dropzone';

import GetUserFileList from '../../services/GetUserFileList';
import GetSignedURL from '../../services/GetSignedURL';
import InsertFileToS3 from '../../services/InsertFileToS3';
import InsertFileToDB from '../../services/InsertFileToDB';

const FileUploader = (props) => {

  const [fileList, setFileList] = React.useState([]);

  useEffect(() => {
      GetUserFileList({accessToken: props.accessToken, username: props.username}).then(function (response) {
        setFileList(response.fileList);
      })
      .catch(function (error) {
        setFileList([]);
      });
  }, []);

    const onDrop = (files) => {
        if (files[0].size > 10000000) {
            alert('File size > 10MB is not allowed');
        }
        const fileKey = files[0].name;
        const urlMain = "https://zf1jtpxmd0.execute-api.us-east-2.amazonaws.com/Dev?fileName=" + 
        files[0].name + "&fileType=" + files[0].type + "&fileKey=" + fileKey;
        GetSignedURL({accessToken: props.accessToken, urlMain}).then(function (response) {                
            InsertFileToS3({url: response, fileData: files[0]}).then(function (response) {
                const filteredFileList = fileList.filter(fileDetail => fileDetail.fileDescription === files[0].name);
                const fileUploadedTime = filteredFileList.length > 0 ? filteredFileList[0].fileUploadedTime : new Date().toString();
                const fileId = filteredFileList.length > 0 ? filteredFileList[0].id : new Date().getTime();
                InsertFileToDB({
                username: props.username,
                fileUploadedTime: fileUploadedTime,
                fileUpdatedTime: new Date().toString(),
                fileDescription: files[0].name,
                firstname: props.firstname,
                lastname: props.lastname,
                id: Number(fileId),
                accessToken: props.accessToken})
                .then(function (response) {
                    alert('File Uploadeded successfully');
                })
                .catch(function (error) {
                    console.log('File Uploadeded successfully but entry is not added to database', error);
                });
            }).catch(function (error) {
                alert('Error in Uploading file');
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