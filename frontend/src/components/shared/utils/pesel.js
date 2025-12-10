// src/components/shared/utils/peselUtils.js

export function birthDateFromPesel(pesel) {
    if (!/^\d{11}$/.test(pesel)) return null;
  
    const yy = parseInt(pesel.slice(0, 2), 10);
    const mmRaw = parseInt(pesel.slice(2, 4), 10);
    const dd = parseInt(pesel.slice(4, 6), 10);
  
    let year;
    let month;
  
    // 1900–1999
    if (mmRaw >= 1 && mmRaw <= 12) {
      year = 1900 + yy;
      month = mmRaw;
    }
    // 2000–2099
    else if (mmRaw >= 21 && mmRaw <= 32) {
      year = 2000 + yy;
      month = mmRaw - 20;
    } else {
      return null; // inne stulecia na razie pomijamy
    }
  
    // Walidacja realności daty (np. 31.02)
    const date = new Date(year, month - 1, dd);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== dd
    ) {
      return null;
    }
  
    // RĘCZNE złożenie formatu yyyy-MM-dd, bez toISOString()
    const mmStr = String(month).padStart(2, "0");
    const ddStr = String(dd).padStart(2, "0");
    return `${year}-${mmStr}-${ddStr}`;
  }
  
  export function isPeselMatchingBirthDate(pesel, birthDate) {
    if (!pesel || !birthDate) return true; // nie blokuj użytkownika gdy coś jeszcze puste
    if (!/^\d{11}$/.test(pesel)) return true; // błąd długości obsługujesz osobno
  
    const peselDate = birthDateFromPesel(pesel);
    if (!peselDate) return true; // nie dubluj komunikatów, zostaw tylko "PESEL musi mieć 11 cyfr" itd.
  
    return peselDate === birthDate;
  }
  