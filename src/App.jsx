import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import RentScheduler from './components/RentScheduler.jsx';
import Expenses from './components/Expenses.jsx';
import LoginForm from './components/LoginForm.jsx';

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const navigate = useNavigate();

  const logout = ()=>{
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null); navigate('/login');
  }

  if(!token){
    return (
      <Routes>
        <Route path="/login" element={<LoginForm onLogin={(t,u)=>{ setToken(t); setUser(u); localStorage.setItem('token',t); localStorage.setItem('user',JSON.stringify(u)); }} />} />
        <Route path="*" element={<LoginForm onLogin={(t,u)=>{ setToken(t); setUser(u); localStorage.setItem('token',t); localStorage.setItem('user',JSON.stringify(u)); }} />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Salim Reza's Property Management System</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/rents">Rents</Link>
          <Link to="/expenses">Expenses</Link>
        </nav>
        <div className="user-box">
          <span>{user?.name} ({user?.role})</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rents" element={<RentScheduler />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </main>
    </div>
  );
}
