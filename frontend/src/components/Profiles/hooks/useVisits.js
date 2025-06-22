import { useState, useEffect, useCallback } from "react";
import { getDonations, getScheduledAppointmentForUser, deleteScheduledAppointment } from "../services/ProfileService";

export function useVisits(userId) {
  const [visits, setVisits] = useState([]);
  const [scheduled, setScheduled] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState({ from: null, to: null });

  const fetch = useCallback(() => {
    setLoading(true); setError(null);
    Promise.all([
      getDonations(userId, range.from?.toISOString(), range.to?.toISOString()),
      getScheduledAppointmentForUser(userId)
    ])
      .then(([v, s]) => {
        setVisits(v);
        setScheduled(s || null);
      })
      .catch(err => setError(err.message || "Błąd ładowania"))
      .finally(() => setLoading(false));
  }, [userId, range]);

  useEffect(fetch, [fetch]);

  const cancelAppointment = (id) =>
    deleteScheduledAppointment(id).then(fetch);

  return { visits, scheduled, loading, error, range, setRange, fetch, cancelAppointment };
}
