import React, { useEffect, useState } from 'react';
import API from '../api';

export default function RentScheduler(){
  const [rents,setRents] = useState([]);
  const [properties,setProperties] = useState([]);
  const [tenants,setTenants] = useState([]);
  const [form,setForm] = useState({ property:'', tenant:'', amount:'', dueDate:'' });

  const fetchData = async ()=>{
    const rentsRes = await API.get('/rents');
    const propsRes = await API.get('/properties');
    const tenantsRes = await API.get('/tenants');
    setRents(rentsRes.data); setProperties(propsRes.data); setTenants(tenantsRes.data);
  }

  useEffect(()=>{ fetchData(); }, []);

  const createRent = async (e)=>{
    e.preventDefault();
    await API.post('/rents', form);
    setForm({ property:'', tenant:'', amount:'', dueDate:'' });
    fetchData();
  }

  const togglePaid = async (r)=>{
    await API.put(`/rents/${r._id}/status`, { paid: !r.paid });
    fetchData();
  }

  const uploadReceipt = async (id, file)=>{
    if(!file) return;
    const fd = new FormData();
    fd.append('receipt', file);
    await API.post(`/rentReceipts/${id}`, fd, { headers:{'Content-Type':'multipart/form-data'} });
    fetchData();
  }

  return (
    <div className="grid" style={{gap:16}}>
      <div className="card">
        <h3>Create Rent Schedule</h3>
        <form onSubmit={createRent} className="grid" style={{gap:8}}>
          <select className="input" value={form.property} onChange={e=>setForm({...form, property:e.target.value})} required>
            <option value="">Select Property</option>
            {properties.map(p=>(<option key={p._id} value={p._id}>{p.builderName}-{p.unitNumber}</option>))}
          </select>
          <select className="input" value={form.tenant} onChange={e=>setForm({...form, tenant:e.target.value})} required>
            <option value="">Select Tenant</option>
            {tenants.map(t=>(<option key={t._id} value={t._id}>{t.name}</option>))}
          </select>
          <input className="input" placeholder="Amount" type="number" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
          <input className="input" placeholder="Due Date" type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} required />
          <button className="btn" type="submit">Add Rent</button>
        </form>
      </div>

      <div className="card">
        <h3>All Rents</h3>
        <ul className="list">
          {rents.map(r=>(
            <li key={r._id} className={!r.paid && new Date(r.dueDate) < new Date() ? 'overdue' : ''}>
              <div>
                <b>{r.property?.builderName}-{r.property?.unitNumber}</b> | {r.tenant?.name} | ${r.amount} | Due: {new Date(r.dueDate).toLocaleDateString()}
                {' '}<span className={`badge ${r.paid?'green':'red'}`}>{r.paid?'Paid':'Unpaid'}</span>
              </div>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <input className="file" type="file" onChange={e=>uploadReceipt(r._id, e.target.files[0])} />
                {r.receiptUrl && <a href={r.receiptUrl} target="_blank">View Receipt</a>}
                <button className="btn" onClick={()=>togglePaid(r)}>Mark {r.paid?'Unpaid':'Paid'}</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
