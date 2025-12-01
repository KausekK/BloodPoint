import { useEffect, useState } from "react";
import Header from "../../../../Header/Header";
import Footer from "../../../../Footer/Footer";
import "../../../../SharedCSS/MenagePanels.css";
import { getHospitalsList } from "../../../../../services/HospitalService";
import { showError } from "../../../../shared/services/MessageService";

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    province: "",
    city: "",
  });

  useEffect(() => {
    getHospitalsList()
      .then((data) => {
        if (Array.isArray(data)) {
          setHospitals(data);
        } else {
          setHospitals([]);
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Nie udało się pobrać listy placówek.";
        showError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  }

  function clearFilters() {
    setFilters({ province: "", city: "" });
  }

  const provinceOptions = [];
  hospitals.forEach((h) => {
    if (h.province && !provinceOptions.includes(h.province)) {
      provinceOptions.push(h.province);
    }
  });
  provinceOptions.sort((a, b) => a.localeCompare(b, "pl"));

  const filteredHospitals = hospitals.filter((h) => {
    const matchProvince =
      !filters.province || h.province === filters.province;

    const cityFilter = filters.city.trim().toLowerCase();
    const matchCity =
      !cityFilter ||
      (h.city && h.city.toLowerCase().includes(cityFilter));

    return matchProvince && matchCity;
  });

  return (
    <>
      <Header />
      <main className="bp-section">
        <div className="bp-container">
          <article className="bp-card">
            <div className="dashboard-head">
              <h2 className="dashboard-title">Lista Placówek Szpitalnych</h2>
              <p className="dashboard-lead">
                Poniżej znajduje się lista wszystkich zarejestrowanych placówek.
              </p>
            </div>

            {!loading && hospitals.length > 0 && (
              <form
                className="bp-form staff-search"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="form-field">
                  <label className="label" htmlFor="provinceFilter">
                    Województwo
                  </label>
                  <select
                    id="provinceFilter"
                    name="province"
                    className="select"
                    value={filters.province}
                    onChange={handleFilterChange}
                  >
                    <option value="">Wszystkie</option>
                    {provinceOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="label" htmlFor="cityFilter">
                    Miasto
                  </label>
                  <input
                    id="cityFilter"
                    name="city"
                    className="input"
                    type="text"
                    placeholder="Filtruj po mieście"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="bp-btn bp-btn--ghost"
                    onClick={clearFilters}
                  >
                    Wyczyść filtry
                  </button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="bp-state">Wczytywanie danych...</div>
            ) : !hospitals.length ? (
              <div className="bp-state">Brak zarejestrowanych placówek.</div>
            ) : !filteredHospitals.length ? (
              <div className="bp-state">
                Brak wyników dla wybranych filtrów.
              </div>
            ) : (
              <div className="table-wrap">
                <table className="bp-table">
                  <thead>
                    <tr>
                      <th>Numer szpitala</th>
                      <th>Województwo</th>
                      <th>Miasto</th>
                      <th>Kod pocztowy</th>
                      <th>Ulica</th>
                      <th>Telefon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHospitals.map((h) => (
                      <tr key={h.id}>
                        <td data-label="Numer szpitala">{h.hospitalNumber}</td>
                        <td data-label="Województwo">{h.province}</td>
                        <td data-label="Miasto">{h.city}</td>
                        <td data-label="Kod pocztowy">{h.zipCode}</td>
                        <td data-label="Ulica">{h.street}</td>
                        <td data-label="Telefon">{h.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
