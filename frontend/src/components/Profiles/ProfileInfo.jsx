import { Button, TextField } from "@mui/material";
import { Edit } from "@mui/icons-material";
import Detail from "./Detail";
import { useProfile } from "./hooks/useProfile";
import { useState, useEffect } from "react";
import { updateProfileContactInfo } from "../../services/ProfileService";

export default function ProfileInfo() {
  const userId = 10; // TODO: zamień na ID pobrane z kontekstu uwierzytelnionego użytkownika
  const { profile, loading, error } = useProfile(userId);
  const [age, setAge] = useState(0);

  const [editPhone, setEditPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.phone != null) {
      setPhoneDraft(profile.phone);
    } else {
      setPhoneDraft("");
    }
  }, [profile]);

  useEffect(() => {
    if (!profile?.birthDate) return;
    const dob = new Date(profile.birthDate);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) years--;
    setAge(years);
  }, [profile]);

  if (loading) return <div className="loading">Ładowanie profilu...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!profile) return <div className="no-data">Brak danych profilu</div>;

  const startEdit = () => {
    setPhoneDraft(profile.phone || "");
    setEditPhone(true);
  };

  const cancelEdit = () => {
    setPhoneDraft(profile.phone || "");
    setEditPhone(false);
  };

  const savePhone = async () => {
    const dto = { ...profile, phone: phoneDraft };
    try {
      setSaving(true);
      await updateProfileContactInfo(dto);
      profile.phone = phoneDraft;
      setEditPhone(false);
    } catch (e) {
      alert("Nie udało się zapisać numeru telefonu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane profilu</h2>

          {!editPhone ? (
            <Button variant="contained" size="small" onClick={startEdit}>
              Edytuj <Edit fontSize="small" />
            </Button>
          ) : (
            <>
              <Button variant="contained" size="small" onClick={savePhone} disabled={saving}>
                Zapisz
              </Button>
              <Button size="small" onClick={cancelEdit} disabled={saving}>
                Anuluj
              </Button>
            </>
          )}
        </header>

        <div className="details-grid">
          <Detail
            label="Imię i nazwisko"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <Detail label="Płeć" value={profile.gender} />
          <Detail label="Wiek" value={age} />
          <Detail label="PESEL" value={profile.pesel} />
          <Detail
            label="Numer telefonu"
            value={
              !editPhone ? (
                profile.phone
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  value={phoneDraft}
                  onChange={(e) => setPhoneDraft(e.target.value)}
                  disabled={saving}
                  autoFocus
                />
              )
            }
          />

          <Detail label="E-mail" value={profile.email} />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Informacje o dawcy</h2>
        <div className="details-grid">
          <Detail
            label="Ilość oddanej krwi"
            value={`${profile.totalDonatedBlood / 1000} litry`}
          />
          <Detail
            label="Ostatnia donacja"
            value={new Date(profile.lastDonationDate).toLocaleDateString()}
          />
          <Detail
            label="Grupa krwi"
            value={`${profile.bloodGroup} Rh${profile.rhFactor}`}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Ogólne</h2>
        <div className="row-between">
          <span className="card-text">Zmień hasło</span>
          <Button variant="contained">Zmień</Button>
        </div>
      </section>
    </div>
  );
}
