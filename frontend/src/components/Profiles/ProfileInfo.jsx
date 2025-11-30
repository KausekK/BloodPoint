import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import Detail from "./Detail";
import { useProfile } from "./hooks/useProfile";
import { useState, useEffect } from "react";
import authService from "../../services/AuthenticationService";
import { updateUserProfileContactInfo } from "../../services/ProfileService";
import { showError, showMessages } from "../shared/services/MessageService";
import { MessageType } from "../shared/const/MessageType.model";
import { changePassword } from "../../services/PasswordService";

export default function ProfileInfo() {
  const [userId, setUserId] = useState(null);
  const [idLoading, setIdLoading] = useState(true);
  const [idError, setIdError] = useState("");

  const [pwdOpen, setPwdOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const { profile, loading, error } = useProfile(userId);
  const [age, setAge] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const id = await authService.getUserId();
        if (active) setUserId(id);
      } catch (e) {
        if (active) {
          setIdError(
            e?.response?.data?.message ||
              e?.message ||
              "Nie udało się pobrać ID użytkownika"
          );
        }
      } finally {
        if (active) setIdLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!profile?.birthDate) return;
    const dob = new Date(profile.birthDate);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) years--;
    setAge(years);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    setPhone(profile.phone || "");
    setEmail(profile.email || "");
  }, [profile]);

  if (idLoading) {
    return <div className="loading">Pobieram identyfikator użytkownika...</div>;
  }
  if (idError) {
    return <div className="error">Błąd: {idError}</div>;
  }
  if (!userId) {
    return <div className="no-data">Nie znaleziono identyfikatora użytkownika</div>;
  }

  if (loading) return <div className="loading">Ładowanie profilu...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;
  if (!profile) return <div className="no-data">Brak danych profilu</div>;

  const genderLabel =
    profile.gender === "K"
      ? "Kobieta"
      : profile.gender === "M"
      ? "Mężczyzna"
      : profile.gender;

  const handleToggleEdit = () => {
    if (!isEditing) {
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
    }
    setIsEditing((prev) => !prev);
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      const res = await updateUserProfileContactInfo({
        id: profile.id,
        email,
        phone,
      });

      const messages = Array.isArray(res?.messages) ? res.messages : [];

      if (messages.length > 0) {
        showMessages(
          messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      }

      const hasError = messages.some((m) => m.type === "ERROR");
      if (hasError) {
        return;
      }

      if (res?.resultDTO) {
        setPhone(res.resultDTO.phone || "");
        setEmail(res.resultDTO.email || "");
      }

      setIsEditing(false);
    } catch (e) {
      console.error(e);
      showError("Wystąpił błąd przy aktualizacji danych kontaktowych.");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPwdOpen(true);
  };

  const handleClosePasswordModal = () => {
    if (!pwdSaving) {
      setPwdOpen(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showError("Wypełnij wszystkie pola hasła.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showError("Nowe hasło i potwierdzenie hasła muszą być takie same.");
      return;
    }

    setPwdSaving(true);
    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      const messages = Array.isArray(res?.messages) ? res.messages : [];

      if (messages.length > 0) {
        showMessages(
          messages.map((m) => ({
            msg: m.msg,
            type: MessageType[m.type] || MessageType.INFO,
          }))
        );
      }

      const hasError = messages.some((m) => m.type === "ERROR");
      if (hasError) {
        return;
      }

      setPwdOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (e) {
      console.error(e);
      showError("Wystąpił błąd przy zmianie hasła.");
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="cards">
      <section className="card">
        <header className="card-header">
          <h2 className="card-title">Dane profilu</h2>
          <Button variant="contained" size="small" onClick={handleToggleEdit}>
            {isEditing ? "Anuluj" : (
              <>
                Edytuj <Edit fontSize="small" />
              </>
            )}
          </Button>
        </header>

        <div className="details-grid">
          <Detail
            label="Imię i nazwisko"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <Detail label="Płeć" value={genderLabel} />
          <Detail label="Wiek" value={age} />
          <Detail label="PESEL" value={profile.pesel} />

          {isEditing ? (
            <div className="detail">
              <span className="detail-label">Numer telefonu</span>
              <TextField
                size="small"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputProps={{ maxLength: 9 }}
              />
            </div>
          ) : (
            <Detail label="Numer telefonu" value={phone} />
          )}

          {isEditing ? (
            <div className="detail">
              <span className="detail-label">E-mail</span>
              <TextField
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <Detail label="E-mail" value={email} />
          )}
        </div>

        {isEditing && (
          <div className="card-actions" style={{ marginTop: "1rem" }}>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleSaveContact}
              disabled={saving}
            >
              Zapisz
            </Button>
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">Informacje o dawcy</h2>
        <div className="details-grid">
          <Detail
            label="Ilość oddanej krwi"
            value={
              profile.totalDonatedBlood != null
                ? `${profile.totalDonatedBlood} l`
                : "-"
            }
          />
          <Detail
            label="Ostatnia donacja"
            value={
              profile.lastDonationDate
                ? new Date(profile.lastDonationDate).toLocaleDateString()
                : "-"
            }
          />
          <Detail
            label="Grupa krwi"
            value={
              profile.bloodGroup && profile.rhFactor
                ? `${profile.bloodGroup} Rh${profile.rhFactor}`
                : "-"
            }
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card-title">Ogólne</h2>
        <div className="row-between">
          <span className="card-text">Zmień hasło</span>
          <Button variant="contained" onClick={handleOpenPasswordModal}>
            Zmień
          </Button>
        </div>
      </section>

      <Dialog
        open={pwdOpen}
        onClose={handleClosePasswordModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Zmień hasło</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Obecne hasło"
            type="password"
            fullWidth
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Nowe hasło"
            type="password"
            fullWidth
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Powtórz nowe hasło"
            type="password"
            fullWidth
            margin="dense"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal} disabled={pwdSaving}>
            Anuluj
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSavePassword}
            disabled={pwdSaving}
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
