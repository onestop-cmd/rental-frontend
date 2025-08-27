import { useState } from 'react';
import { addProperty } from '../api';
export default function AddProperty(){
  const [form,setForm] = useState({ propertyNumber:'', propertyName:'', units: [{ unitName:'', unitRent:'', marketRent:'' }]});
  const submit = async (e) => {
    e.preventDefault();
    // convert numbers
    const payload = { ...form, units: form.units.map(u=>({ ...u, unitRent: Number(u.unitRent), marketRent: Number(u.marketRent) })) };
    await addProperty(payload);
    alert('Property added');
    setForm({ propertyNumber:'', propertyName:'', units:[{unitName:'',unitRent:'',marketRent:''}]});
  };
  return (
    <div>
      <h3>Add Property</h3>
      <form onSubmit={submit}>
        <input placeholder='Property Number' value={form.propertyNumber} onChange={e=>setForm({...form,propertyNumber:e.target.value})} />
        <input placeholder='Property Name' value={form.propertyName} onChange={e=>setForm({...form,propertyName:e.target.value})} />
        <h4>First Unit</h4>
        <input placeholder='Unit Name' value={form.units[0].unitName} onChange={e=>setForm({...form,units:[{...form.units[0],unitName:e.target.value}]})} />
        <input placeholder='Unit Rent' value={form.units[0].unitRent} onChange={e=>setForm({...form,units:[{...form.units[0],unitRent:e.target.value}]})} />
        <input placeholder='Market Rent' value={form.units[0].marketRent} onChange={e=>setForm({...form,units:[{...form.units[0],marketRent:e.target.value}]})} />
        <button type='submit'>Add Property</button>
      </form>
    </div>
  );
}
