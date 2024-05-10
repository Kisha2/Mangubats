// DataForm.jsx
import { Button, Popconfirm, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Update from './Edit';
import Add from './Add';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './DataForm.css'; // Import CSS file for styling

const DataForm = () => {
  const [updateMode, setUpdateMode] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://serverless-api-fetizanan.netlify.app/.netlify/functions/api")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  function handleDelete(id) {
    axios
      .delete(`https://serverless-api-fetizanan.netlify.app/.netlify/functions/api/${id}`)
      .then(() => {
        setData(data.filter((item) => item._id !== id));
        message.success('Data deleted successfully');
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
      });
  }

  const handleUpdateClick = (record) => {
    setUpdateRecord(record);
    setUpdateMode(true);
  };

  const handleUpdate = (id, updatedData) => {
    setData(data.map(item => item._id === id ? { ...item, ...updatedData } : item));
    setUpdateMode(false);
  };

  const handleAdd = (newData) => {
    setData([...data, newData]);
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: 'name',
      key: 'name',
      width: 550, // Set width to 200 pixels
    },
    
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 350, // Set width to 100 pixels
    },
    {
      title: (
        <span>
          Action
          <Add onAdd={handleAdd} />
        </span>
      ),
      key: 'action',
      render: (text, record) => (
        <span className="flex gap-3">
          <EditOutlined 
              style={{
                  width:'3rem'
              }}
              onClick={() => handleUpdateClick(record)}
          />
          
          <Popconfirm
            title="Are you sure you want to delete this data?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined type='primary' color='red'/>
          </Popconfirm>
        </span>
      ),
    },
  ];
  
  return (
    <div className="data-form-container"> {/* Add a class for full screen styling */}
      <Table columns={columns} dataSource={data} className="pastel-table" /> {/* Add a class for pastel table styling */}
      {updateMode && <Update record={updateRecord} onCancel={() => setUpdateMode(false)} onUpdate={handleUpdate} />}
    </div>
  );
};

export default DataForm;
