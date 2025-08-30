import React, { useEffect, useState } from 'react';
import API from '../api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Expenses(){
  const [properties,setProperties] = useState([]);
  const [expenses,setExpenses] = useState([]);
  const [form,setForm] = useState({ property:'', description:'', amount:'', date:'' });

  const fetchData = async ()=>{
    const propsRes = await API.get('/properties');
    const exRes = await API.get('/expenses');
    setProperties(propsRes.data); setExpenses(exRes.data);
  }
  useEffect(()=>{ fetchData(); }, []);

  const addExpense = async (e)=>{
    e.preventDefault();
    await API.post('/expenses', form);
    setForm({ property:'', description:'', amount:'', date:'' });
    fetchData();
  }

  const summary = properties.map(p=> ({
    name: `${p.builderName}-${p.unitNumber}`,
    total: expenses.filter(e=>e.property?._id===p._id).reduce((a,e)=>a+Number(e.amount||0),0)
  }));

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>Add Expense</h3>
        <form onSubmit={addExpense} className="grid" style={{gap:8}}>
          <select className="input" value={form.property} onChange={e=>setForm({...form, property:e.target.value})} required>
            <option value="">Select Property</option>
            {properties.map(p=>(<option key={p._id} value={p._id}>{p.builderName}-{p.unitNumber}</option>))}
          </select>
          <input className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required />
          <input className="input" type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
          <input className="input" type="date" placeholder="Date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          <button className="btn" type="submit">Add Expense</button>
        </form>
      </div>

      <div className="card">
        <h3>Expenses by Building</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>All Expenses</h3>
        <ul className="list">
          {expenses.map(e=>(
            <li key={e._id}>
              <div><b>{e.property?.builderName}-{e.property?.unitNumber}</b> | {new Date(e.date).toLocaleDateString()}</div>
              <div>{e.description} — ${e.amount}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
