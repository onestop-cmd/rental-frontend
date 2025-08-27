import { useEffect, useState } from 'react';
import { getProperties } from '../api';
export default function PropertyList(){
  const [props,setProps] = useState([]);
  useEffect(()=>{ getProperties().then(r=>setProps(r.data)).catch(()=>{}) },[]);
  return (
    <div>
      <h3>Your Properties</h3>
      <ul>
        {props.map(p=>(
          <li key={p._id}>{p.propertyNumber} - {p.propertyName}
            <ul>
              {p.units?.map((u,i)=>(<li key={i}>{u.unitName}: ${u.unitRent} (market ${u.marketRent})</li>))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
