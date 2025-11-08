import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import { getPoints, getCities } from "../../services/BloodDonationPointService";
import Map from "../Map/Map";
import "./DonationPointsPage.css";
import content from "../../content/DonationPoints/DonationPoints.json";

const PAGE_SIZE = 6;

export default function DonationPointsPage() {
  const [points, setPoints] = useState([]);
  const [cities, setCities] = useState([]);
  const [filterCity, setFilterCity] = useState("");
  const [mapCity, setMapCity] = useState("");
  const [page, setPage] = useState(1);

  const labels = content.labels || {};
  const buttons = content.buttons || {};

  const hoursText = `${content.hoursFixedStart ?? "08:00"}${content.hoursSeparator ?? " – "}${content.hoursFixedEnd ?? "16:00"}`;

  useEffect(() => {
    getCities().then(setCities).catch(() => setCities([]));
    getPoints()
      .then((list) => {
        setPoints(list);
        if (list.length > 0) setMapCity(list[0].city);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setPage(1);
    getPoints(filterCity || undefined)
      .then((list) => {
        setPoints(list);
        if (list.length > 0) setMapCity(list[0].city);
      })
      .catch(console.error);
  }, [filterCity]);

  const paged = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(points.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return {
      items: points.slice(start, start + PAGE_SIZE),
      totalPages,
      page: safePage,
    };
  }, [points, page]);

  function prev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function next() {
    setPage((p) => Math.min(paged.totalPages, p + 1));
  }

  return (
    <>
      <Header />
      <main className="bp-section info-page points">
        <div className="bp-container">
          <header className="info-head">
            <h1 className="info-title">{content.title}</h1>
            <p className="info-lead">{content.lead}</p>

            <div className="points-filters">
              <div className="filter-group">
                <label className="filter-label" htmlFor="cityFilter">
                  {labels.cityFilter || "Miasto"}
                </label>
                <div className="select-wrap">
                  <select
                    id="cityFilter"
                    className="select"
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                  >
                    <option value="">{content.allCities || "Wszystkie miasta"}</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="bp-btn bp-btn--ghost clear-btn"
                onClick={() => setFilterCity("")}
                disabled={!filterCity}
              >
                Wyczyść
              </button>
            </div>
          </header>

          <div className="points-layout">
            <section className="points-grid" aria-label="Punkty krwiodawstwa">
              {paged.items.map((p) => {
                const isSelected = mapCity === p.city;
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  p.city + " " + p.street
                )}`;

                return (
                  <article
                    key={p.id}
                    className={`bp-card point ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setMapCity(p.city)}
                    tabIndex={0}
                  >
                    <div className="point-head">
                      <h2 className="point-city">{p.city}</h2>
                      <span className="point-phone">{p.phone}</span>
                    </div>

                    <div className="point-rows">
                      <div className="point-row">
                        <span className="point-label">{labels.address || "Adres"}</span>
                        <span className="point-val">
                          {p.street}, {p.zipCode}
                        </span>
                      </div>
                      <div className="point-row">
                        <span className="point-label">{labels.hours || "Godziny"}</span>
                        <span className="point-val point-hours">{hoursText}</span>
                      </div>
                    </div>

                    <div className="point-cta info-cta">
                      <button
                        type="button"
                        className="bp-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMapCity(p.city);
                        }}
                      >
                        {buttons.showOnMap || "Pokaż na mapie"}
                      </button>
                      <a
                        className="bp-btn bp-btn--ghost"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {buttons.openInGoogleMaps || "Otwórz w Google Maps"}
                      </a>
                    </div>
                  </article>
                );
              })}

              {points.length === 0 && (
                <div className="bp-card point point-empty">
                  {content.emptyState || "Brak danych do wyświetlenia."}
                </div>
              )}
            </section>

            <aside className="points-map">
              {mapCity ? <Map key={mapCity} city={mapCity} /> : <div className="map-placeholder">{content.mapPlaceholder}</div>}
            </aside>
          </div>

          {points.length > PAGE_SIZE && (
            <nav className="points-pagination">
              <button className="bp-btn bp-btn--ghost" onClick={prev} disabled={paged.page === 1}>
                {buttons.prev || "Poprzednia"}
              </button>
              <ul className="pages">
                {Array.from({ length: paged.totalPages }, (_, i) => i + 1).map((n) => (
                  <li key={n}>
                    <button
                      className={`page ${n === paged.page ? "is-active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  </li>
                ))}
              </ul>
              <button className="bp-btn bp-btn--ghost" onClick={next} disabled={paged.page === paged.totalPages}>
                {buttons.next || "Następna"}
              </button>
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
