import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import styles from './TodoList.module.css';
import { getErrorMessage } from '../../utils/GetError'
import { Button, Input, Divider, Modal,App } from 'antd';
import { getUserDetails } from '../../utils/GetUser';
import ToDoServices from '../../services/todoServices';

function TodoList() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { message: messageApi } = App.useApp();
  const handleSubmitTask = async () => {
    setLoading(true);
    try {
      const userDetails = getUserDetails();
      const userId = userDetails?.userId;


      let data = {
        title,
        description,
        isCompleted: false,
        userId: userId
      }

      const response = await ToDoServices.createToDo(data);
      console.log("API Response:", response);
      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);
      
      if (response.status === 200 || response.status === 201) {
        messageApi.success("To Do Task Added Successfully");
        console.log("Ant Design message.success should be displayed.");
      }
      
      setIsAdding(false);
      setLoading(false);

    } catch (err) {
      console.log("=== ERROR ===", err);
      messageApi.error(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar active={"myTask"} />

      <section className={styles.toDoWrapper}>
        <div className={styles.toDoHeader}>
          <h2>Your Tasks</h2>
          <input style={{ width: '50%' }} placeholder='Search Your Task Here...' />
          <div>
            <Button onClick={() => {
              console.log("Add Task button clicked!");
              setIsAdding(true);
            }} type="primary" size="large">Add Task</Button>
          </div>
        </div>
        <Divider />

        <Modal confirmLoading={loading} title="Add New To Do Task" open={isAdding} onOk={handleSubmitTask} onCancel={() => setIsAdding(false)}>
          <Input style={{ marginBottom: '1rem' }} placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input.TextArea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </Modal>

      </section>
    </>
  )
}

export default TodoList
