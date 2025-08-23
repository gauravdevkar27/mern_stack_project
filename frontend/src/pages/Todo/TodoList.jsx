import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import styles from './TodoList.module.css';
import { getErrorMessage } from '../../utils/GetError'
import { Button, Input, Divider, Modal, Tag, Tooltip, App, Select } from 'antd';
import { getUserDetails } from '../../utils/GetUser';
import ToDoServices from '../../services/todoServices';
import { useNavigate } from 'react-router';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';


function TodoList() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const { message: messageApi } = App.useApp();
  const [allToDo, setAllToDo] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [currentEditItem, setCurrentEditItem] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {

    let user = getUserDetails();

    const getAllToDos = async () => {
      try {

        const response = await ToDoServices.getAllToDo();
        console.log(response.data);
        setAllToDo(response.data.data);

      } catch (err) {
        console.log(err);
        messageApi.error(getErrorMessage(err));
      }
    }
    if (user && user?.userId) {
      getAllToDos();
    }
    else {
      navigate('/login');
    }
  }, [navigate, messageApi])

  const getFormattedDate = (value) => {
    let date = new Date(value);
    let dateString = date.toDateString();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();
    let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }

  const handleSubmitTask = async () => {
    setLoading(true);
    try {
      let data = {
        title,
        description,
        isCompleted: false,
      }

      const response = await ToDoServices.createToDo(data);
      const newTask = response.data.data;

      // Add new task to the list and reset form fields
      setAllToDo([newTask, ...allToDo]);
      setTitle("");
      setDescription("");

      messageApi.success("To Do Task Added Successfully");

      setIsAdding(false);
      setLoading(false);

    } catch (err) {
      console.error("Failed to create task:", err);
      messageApi.error(getErrorMessage(err));
      setLoading(false);
    }
  }
  
  const handleEdit = (item) => {
    console.log(item);
    setCurrentEditItem(item);
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedStatus(item?.isCompleted);
    setIsEditing(true);
  }
  const handleDelete = (item) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: `You are about to delete "${item.title}". This action cannot be undone.`,
      okText: 'Yes, Delete It',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        // Store the original state in case of an error
        const originalToDos = [...allToDo];

        // Optimistic UI update: remove the item from the list immediately
        setAllToDo(allToDo.filter(todo => todo._id !== item._id));

        try {
          // Call the API to delete the task from the database
          await ToDoServices.deleteToDo(item._id);
          messageApi.success(`Task "${item.title}" deleted successfully.`);
        } catch (err) {
          // If the API call fails, revert the UI and show an error message
          console.error("Failed to delete task:", err);
          messageApi.error(getErrorMessage(err));
          setAllToDo(originalToDos);
        }
      }
    });
  }

  const handleUpdateStatus = async (id, newStatus) => {
    const task = allToDo.find(todo => todo._id === id);
    if (!task) return;

    // Optimistic UI update
    const originalToDos = [...allToDo];
    setAllToDo(allToDo.map(todo =>
      todo._id === id ? { ...todo, isCompleted: newStatus, updatedAt: new Date().toISOString() } : todo
    ));

    try {
      const data = { isCompleted: newStatus };
      await ToDoServices.updateToDo(id, data);
      messageApi.success(`Task "${task.title}" status updated.`);
    } catch (err) {
      console.error("Failed to update status:", err);
      messageApi.error(getErrorMessage(err));
      // Revert on error
      setAllToDo(originalToDos);
    }
  }
  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      let data = {
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedStatus

      };
      const response = await ToDoServices.updateToDo(currentEditItem._id, data);
      // Assuming the updated task is in response.data.data
      const updatedTask = response.data.data;
      messageApi.success(`${currentEditItem?.title} Updated Successfully`);

      // Update the allToDo state with the new task data
      setAllToDo(allToDo.map(todo =>
        todo._id === updatedTask._id ? updatedTask : todo
      ));

      setLoading(false);
      setIsEditing(false);
      
    } catch (err) {
      console.log(err);
      setLoading(false);
      messageApi.error(getErrorMessage(err));
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

        <div className={styles.toDoListCardWrapper}>
          {allToDo && allToDo.map((item) => (
            <div key={item?._id} className={styles.toDoCard}>
              <div>
                <div className={styles.toDoCardHeader}>
                  <h3>{item?.title}</h3>
                  {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                </div>
                <p>{item?.description}</p>
              </div>

              <div className={styles.toDoCardFooter}>
                <Tag>{getFormattedDate(item?.updatedAt || item?.createdAt)}</Tag>
                <div className={styles.toDoFooterAction}>
                  <Tooltip title="Edit Task?"><EditOutlined onClick={() => handleEdit(item)} className={styles.actionIcon} /></Tooltip>
                  <Tooltip title="Delete Task?"><DeleteOutlined onClick={() => handleDelete(item)} style={{ color: 'red' }} className={styles.actionIcon} /></Tooltip>
                  {item?.isCompleted ?
                    <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={() => handleUpdateStatus(item._id, false)} style={{ color: 'green' }} className={styles.actionIcon} /></Tooltip> :
                    <Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={() => handleUpdateStatus(item._id, true)} className={styles.actionIcon} /></Tooltip>}
                </div>
              </div>
            </div>
          ))}
        </div>
         //add the task window
        <Modal confirmLoading={loading} title="Add New To Do Task" open={isAdding} onOk={handleSubmitTask} onCancel={() => setIsAdding(false)}>
          <Input style={{ marginBottom: '1rem' }} placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input.TextArea placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
        </Modal>
        // update the task window
        <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={() => setIsEditing(false)}>
          <Input style={{ marginBottom: '1rem' }} placeholder='Updated Title' value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
          <Input.TextArea style={{ marginBottom: '1rem' }} placeholder='Updated Description' value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
          <Select
           onChange={(value) => setUpdatedStatus(value)}
           value={updatedStatus}
           options={[
            {
                value: false,
                label: 'Not Completed',
           },

              {
                value: true,
                label: 'Completed',
              },

            ]}
          />
        </Modal>


      </section>
    </>
  )
}

export default TodoList
