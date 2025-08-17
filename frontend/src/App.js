import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './pages/Auth/Register.jsx';
import TodoList from './pages/Todo/TodoList.jsx';
import Landing from './pages/Landing/Landing.jsx';
import Login from './pages/Auth/Login.jsx';
import './App.css';
import 'antd/dist/reset.css';
import { App as AntApp } from 'antd';
import { AuthProvider } from './context/Authcontext.js';

function App() {
  return (
    <AuthProvider>
      <AntApp>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/to-do-list' element={<TodoList />} />
        </Routes>
      </AntApp>
    </AuthProvider>
  );
}

export default App;
