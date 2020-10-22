import React, { useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';
import axios from "axios";

const FileList = (props) => {
  const [fileList, setFileList] = React.useState([]);
  const columns = [
    { field: 'fileDescription', headerName: 'File Name', width: 150 },
    ...(props.username === 'admin' ? [ { field: 'username', headerName: 'Username', width: 100 }] : []),
    { field: 'fileUpdatedTime', headerName: 'Last Modified', width: 250 },
    { field: 'fileUploadedTime', headerName: 'Last Modified', width: 250 },
    {
      field: 'download',
      headerName: 'Download',
      width: 150,
      renderCell: (params) => (
        <strong>
          <span>Download</span>
        </strong>
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => (
        <strong>
          <span>Delete</span>
        </strong>
      )
    },
  ];
  
  useEffect(() => {
    
    // Get File list from database
    if (props.username === 'admin'){
      // axios({
      //   method: "Get",
      //   url: '/getFullFileList'
      // })
      axios.get("https://ljxyouiyd5.execute-api.us-east-2.amazonaws.com/Dev",
          {headers: {Authorization: props.accessToken}})
      .then(function (response) {
        console.log(response);
        const fileList = [];
        if (response.data.length > 0) {
          response.data.forEach(function(element) {
            fileList.push({
              id: element.id.N,
              username: element.username.S,
              fileUpdatedTime: element.fileUpdatedTime.S,
              fileUploadedTime: element.fileUploadedTime.S,
              fileDescription: element.fileDescription.S
            });
          });
          setFileList(fileList);
        }
      })
      .catch(function (error) {
        setFileList([]);
        console.log(error);
      });  
    } else if (props.username !== ''){
      // axios({
      //   method: "POST",
      //   url: '/getFileList',
      //   data: {
      //       username: props.username
      //     },
      // })
      axios.put("https://8m3i32xwsj.execute-api.us-east-2.amazonaws.com/Dev", {username: props.username},
          {headers: {Authorization: props.accessToken}})
      .then(function (response) {
        console.log(response);
        const fileList = [];
        if (response.data.length > 0) {
          response.data.forEach(function(element, index, array) {
            fileList.push({
              id: element.id.N,
              username: element.username.S,
              fileUpdatedTime: element.fileUpdatedTime.S,
              fileUploadedTime: element.fileUploadedTime.S,
              fileDescription: element.fileDescription.S});
          });
        }
        setFileList(fileList);
      })
      .catch(function (error) {
        setFileList([]);
        console.log(error);
      });  
    }
  }, [props.username]);


  const cellClick = (params, accessToken) => {
    const file = params.getValue('fileDescription');
    const fileId = params.getValue('id');
    if (params.field === 'delete') {
      axios.put('https://h1wipggwz9.execute-api.us-east-2.amazonaws.com/Dev', {filename: file}, {headers: {Authorization: accessToken}}).then((response) => {
        // axios({
        //   method: "POST",
        //   url: '/deleteFile',
        //   data: {
        //       username: props.username,
        //       filename: file
        //     },
        // })
        axios.put("https://v8rqpxbfs3.execute-api.us-east-2.amazonaws.com/Dev", {id: fileId},
          {headers: {Authorization: props.accessToken}})
        .then(function (response) {
          console.log(response);
          alert('File Deleted successfully');
          const filteredFileList  = fileList.filter(function( obj ) {
            return obj.fileDescription !== file;
          });
          setFileList(filteredFileList);

        })
        .catch(function (error) {
          console.log(error);
        });  
      
      });
    } else if (params.field === 'download') {
      axios.put('https://ug1bk5i0i1.execute-api.us-east-2.amazonaws.com/Dev', {filename: file}, {headers: {Authorization: accessToken}}).then((response) => {
        alert('File Downloaded successfully');
        // let blob = new Blob([response.data.Body], { type: response.data.ContentType });
        // let link = document.createElement("a");
        // link.href = window.URL.createObjectURL(blob);
        
        
        let link = document.createElement("a");
        link.href = response.data;
        
        
        link.download = file;
        link.target = "_blank";
        link.download = file;
        link.click();
      });
    }
    
  }

  return (
    <div style={{ height: 400, width: '90%' }}>
      <DataGrid rows={fileList} columns={columns} pageSize={5} onCellClick={(params) => cellClick(params, props.accessToken)}/>
    </div>
  );
}

export default FileList;