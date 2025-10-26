import { useState, useEffect } from "react";
import { getProfile } from "../../../services/ProfileService";

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId == null) return;

    setLoading(true);
    setError(null);
    setProfile(null);

    getProfile(userId)
      .then((data) => setProfile(data))
      .catch((err) => setError(err?.message || "Błąd ładowania profilu"))
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading, error };
}
