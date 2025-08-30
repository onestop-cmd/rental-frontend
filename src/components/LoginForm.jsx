import React, { useState } from 'react';
import API from '../api';

export default function LoginForm({ onLogin }){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const [isRegister,setIsRegister] = useState(false);
  const [role,setRole] = useState('user');
  const [err,setErr] = useState('');

  const submit = async (e)=>{
    e.preventDefault();
    setErr('');
    try{
      if(isRegister){
        await API.post('/auth/register', { name, email, password, role });
        setIsRegister(false);
        alert('Registered! Please log in.');
      }else{
        const res = await API.post('/auth/login', { email, password });
        onLogin(res.data.token, res.data.user);
      }
    }catch(ex){ setErr(ex.response?.data?.error || 'Error'); }
  }

  return (
    <div style={{display:'grid', placeItems:'center', minHeight:'100vh', background:'#f5f6f8'}}>
      <form onSubmit={submit} className="card" style={{width:360}}>
        <h2 style={{marginTop:0}}>{isRegister ? 'Register' : 'Login'}</h2>
        {isRegister && <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />}
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{marginTop:8}} />
        <input type="password" className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{marginTop:8}} />
        {isRegister && (
          <select className="input" style={{marginTop:8}} value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="user">Regular User</option>
            <option value="admin">Admin</option>
          </select>
        )}
        {err && <div className="badge red" style={{marginTop:8}}>{err}</div>}
        <button className="btn" style={{marginTop:12}} type="submit">{isRegister? 'Create account' : 'Login'}</button>
        <button type="button" className="btn secondary" style={{marginTop:8}} onClick={()=>setIsRegister(!isRegister)}>
          {isRegister? 'Have an account? Login' : 'No account? Register'}
        </button>
      </form>
    </div>
  );
}
