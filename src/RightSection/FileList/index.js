import React, { useEffect } from "react";
import { DataGrid } from '@material-ui/data-grid';

import GetFullFileList from '../../services/GetFullFileList';
import GetUserFileList from '../../services/GetUserFileList';
import DeleteFileFromDB from '../../services/DeleteFileFromDB';
import DeleteFileFromS3 from '../../services/DeleteFileFromS3';
import DownloadFile from '../../services/DownloadFile';

const FileList = (props) => {
  const [fileList, setFileList] = React.useState([]);
  const columns = [
    { field: 'fileDescription', headerName: 'File Name', width: 150 },
    ...(props.username === 'admin' ? [ { field: 'username', headerName: 'Username', width: 100 }] : []),
    { field: 'firstname', headerName: 'First Name', width: 120},
    { field: 'lastname', headername: 'Last Name', width: 120},
    { field: 'fileUpdatedTime', headerName: 'Last Modified', width: 250 },
    { field: 'fileUploadedTime', headerName: 'Last Uploaded', width: 250 },
    {
      field: 'download',
      headerName: 'Download',
      width: 130,
      renderCell: (params) => (
        <strong>
          <span>Download</span>
        </strong>
      )
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 130,
      renderCell: (params) => (
        <strong>
          <span>Delete</span>
        </strong>
      )
    },
  ];
  
  useEffect(() => {    
    if (props.username === 'admin'){
      GetFullFileList({accessToken: props.accessToken}).then(function (response) {
        setFileList(response.fileList);
      })
      .catch(function (error) {
        setFileList([]);
      }); 
    } else if (props.username !== ''){
      GetUserFileList({accessToken: props.accessToken, username: props.username}).then(function (response) {
        setFileList(response.fileList);
      })
      .catch(function (error) {
        setFileList([]);
      });
    }
  }, []);


  const cellClick = (params, accessToken) => {
    const file = params.getValue('fileDescription');
    const fileId = params.getValue('id');
    if (params.field === 'delete') {
        DeleteFileFromS3({accessToken: props.accessToken, file}).then(function (response) {
          DeleteFileFromDB({accessToken: props.accessToken, fileId}).then(function (response) {
            alert('File Deleted successfully');
            const filteredFileList  = fileList.filter(function( obj ) {
              return obj.fileDescription !== file;
            });
            setFileList(filteredFileList);
          });
        })
        .catch(function (error) {
          alert('Error Deleting File');
        });

    } else if (params.field === 'download') {
      DownloadFile({accessToken: props.accessToken, file}).then(function (response) {
          alert('File Downloaded successfully');
         
          let link = document.createElement("a");
          link.href = response;       
          link.download = file;
          link.target = "_blank";
          link.download = file;
          link.click();
      })
      .catch(function (error) {
        alert('Error Downloading File');
      });
    }
  }

  return (
    <div style={{ height: 400, width: '98%' }}>
      <DataGrid rows={fileList} columns={columns} pageSize={5} onCellClick={(params) => cellClick(params, props.accessToken)}/>
    </div>
  );
}

export default FileList;