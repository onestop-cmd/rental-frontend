import React, { useEffect, useState } from 'react';
import API from '../api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Dashboard(){
  const [rents,setRents] = useState([]);
  const [expenses,setExpenses] = useState([]);

  const fetchData = async ()=>{
    const rentsRes = await API.get('/rents');
    const exRes = await API.get('/expenses');
    setRents(rentsRes.data);
    setExpenses(exRes.data);
  }

  useEffect(()=>{ fetchData(); }, []);

  const overdue = rents.filter(r=>!r.paid && new Date(r.dueDate) < new Date());
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthly = months.map((m,i)=> ({
    month: m,
    Rent: rents.filter(r=>r.paid && new Date(r.dueDate).getMonth()===i).reduce((a,r)=>a+Number(r.amount||0),0),
    Expense: expenses.filter(e=>new Date(e.date).getMonth()===i).reduce((a,e)=>a+Number(e.amount||0),0)
  }));

  const paidTotal = rents.filter(r=>r.paid).reduce((a,r)=>a+Number(r.amount||0),0);
  const expenseTotal = expenses.reduce((a,e)=>a+Number(e.amount||0),0);

  return (
    <div className="grid" style={{gap:16}}>
      {overdue.length>0 && <div className="card overdue">⚠ {overdue.length} rent(s) overdue</div>}

      <div className="grid grid-3">
        <div className="card"><b>Total Rent Collected</b><div style={{fontSize:24}}>${paidTotal}</div></div>
        <div className="card"><b>Total Expenses</b><div style={{fontSize:24}}>${expenseTotal}</div></div>
        <div className="card"><b>Overdue Rents</b><div style={{fontSize:24}}>{overdue.length}</div></div>
      </div>

      <div className="card">
        <h3>Monthly Rent vs Expense</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Rent" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
