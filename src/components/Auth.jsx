import { useState } from 'react';
import { loginUser, registerUser } from '../api';
export default function Auth({ setUser }){
  const [form,setForm] = useState({ username:'', password:'' });
  const [isLogin,setIsLogin] = useState(true);
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = isLogin ? await loginUser(form) : await registerUser(form);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      } else if (!isLogin && res.data.user) {
        alert('Registered. Please login.');
        setIsLogin(true);
      }
    } catch(err){
      alert('Auth failed');
    }
  };
  return (
    <div style={{padding:20}}>
      <h2>{isLogin?'Login':'Register'}</h2>
      <form onSubmit={submit}>
        <input placeholder='username' value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
        <input type='password' placeholder='password' value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button type='submit'>{isLogin?'Login':'Register'}</button>
      </form>
      <button onClick={()=>setIsLogin(!isLogin)}>{isLogin?'Need account? Register':'Have account? Login'}</button>
    </div>
  );
}
