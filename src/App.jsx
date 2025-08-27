import { useState } from 'react';
import Auth from './components/Auth';
import AddProperty from './components/AddProperty';
import PropertyList from './components/PropertyList';
import RentSchedule from './components/RentSchedule';

export default function App(){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'));
  if (!user) return <Auth setUser={u=>{ localStorage.setItem('user', JSON.stringify(u)); setUser(u); }} />;
  return (
    <div style={{padding:20,fontFamily:'Arial, sans-serif'}}>
      <h1>Rental Property Manager</h1>
      <p>Welcome, {user.username} <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }}>Logout</button></p>
      <AddProperty />
      <PropertyList />
      <hr />
      <RentSchedule />
    </div>
  );
}
