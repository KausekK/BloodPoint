// import { useEffect, useState, useMemo } from "react";
// import { createBloodRequest } from "../../../services/BloodRequestService";

// export default function ReportEmergencyPage() {
//   const [hospitals, setHospitals] = useState([]);
//   const [bloodTypes, setBloodTypes] = useState([]);
//   const [form, setForm] = useState({ hospitalId: "", bloodTypeId: "", amount: "" });
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState({ type: "", text: "" });

//   useEffect(() => {
//     Promise.all([getHospitals(), getBloodTypes()])
//       .then(([hs, bts]) => { setHospitals(hs || []); setBloodTypes(bts || []); })
//       .catch(() => setMsg({ type: "error", text: "Nie udało się pobrać danych." }));
//   }, []);

//   const btOptions = useMemo(() =>
//     (bloodTypes || []).map(bt => ({
//       id: bt.id,
//       label: `${bt.group}${bt.rhFactor ? bt.rhFactor.replace(" ", "") : ""}`
//     })), [bloodTypes]
//   );

//   function onChange(e) {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value }));
//     setMsg({ type: "", text: "" });
//   }

//   async function onSubmit(e) {
//     e.preventDefault();
//     const { hospitalId, bloodTypeId, amount } = form;
//     const amountNum = Number(amount);

//     if (!hospitalId || !bloodTypeId || !amountNum || amountNum <= 0) {
//       setMsg({ type: "error", text: "Uzupełnij poprawnie wszystkie pola." });
//       return;
//     }

//     setBusy(true);
//     try {
//       await createBloodRequest({ hospitalId: Number(hospitalId), bloodTypeId: Number(bloodTypeId), amount: amountNum });
//       setMsg({ type: "ok", text: "Zapotrzebowanie zostało zgłoszone." });
//       setForm(f => ({ ...f, amount: "" }));
//     } catch {
//       setMsg({ type: "error", text: "Nie udało się zgłosić zapotrzebowania." });
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <section className="panel-dashboard is-centered">
//       <div style={{ width: "min(720px, 92%)" }}>
//         <header className="panel-head">
//           <h1 className="panel-title">Zgłoszenie zapotrzebowania</h1>
//           <p className="panel-lead">Wybierz szpital, grupę krwi i ilość.</p>
//         </header>

//         <form className="panel-actions" onSubmit={onSubmit}>
//           <div>
//             <label htmlFor="hospitalId">Szpital</label>
//             <select id="hospitalId" name="hospitalId" className="panel-btn" value={form.hospitalId} onChange={onChange} required>
//               <option value="">— wybierz szpital —</option>
//               {hospitals.map(h => (
//                 <option key={h.id} value={h.id}>
//                   {`#${h.hospitalNumber ?? h.id} • ${h.city}, ${h.street}`}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="bloodTypeId">Grupa krwi</label>
//             <select id="bloodTypeId" name="bloodTypeId" className="panel-btn" value={form.bloodTypeId} onChange={onChange} required>
//               <option value="">— wybierz grupę —</option>
//               {btOptions.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
//             </select>
//           </div>

//           <div>
//             <label htmlFor="amount">Ilość (jednostki)</label>
//             <input
//               id="amount" name="amount" type="number" min="1" step="1"
//               className="panel-btn" placeholder="np. 5"
//               value={form.amount} onChange={onChange} required
//             />
//           </div>

//           {msg.text && (
//             <div className={`panel-cta ${msg.type === "error" ? "is-ghost" : ""}`} role={msg.type === "error" ? "alert" : "status"}>
//               {msg.text}
//             </div>
//           )}

//           <button className="panel-btn" type="submit" disabled={busy}>
//             {busy ? "Wysyłanie..." : "Zgłoś zapotrzebowanie"}
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// }
