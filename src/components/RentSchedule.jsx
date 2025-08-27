import { useEffect, useState } from 'react';
import { fetchSchedules, updateScheduleStatus } from '../api';
export default function RentSchedule(){
  const [schedules,setSchedules] = useState([]);
  useEffect(()=>{ fetchSchedules().then(r=>setSchedules(r.data)).catch(()=>{}) },[]);
  const mark = async (id, status) => {
    const res = await updateScheduleStatus(id, status);
    setSchedules(schedules.map(s=> s._id===id?res.data:s));
  };
  return (
    <div>
      <h3>Rent Schedule</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>Tenant</th><th>Month</th><th>Due</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {schedules.map(s=>(
            <tr key={s._id}>
              <td>{s.tenantId?.tenantName}</td>
              <td>{s.month}</td>
              <td>{new Date(s.dueDate).toLocaleDateString()}</td>
              <td>${s.amount}</td>
              <td>{s.status}</td>
              <td>
                <button onClick={()=>mark(s._id,'Paid')}>Mark Paid</button>
                <button onClick={()=>mark(s._id,'Unpaid')}>Mark Unpaid</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
