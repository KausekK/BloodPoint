import { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import { getPoints, getCities } from "../../services/BloodDonationPointService";
import Map from "../Map/Map";
import "./DonationPointsPage.css";
import content from "../../data/DonationPoints/DonationPoints.json";

const PAGE_SIZE = 6;

export default function DonationPointsPage() {
    const [points, setPoints] = useState([]);
    const [cities, setCities] = useState([]);
    const [filterCity, setFilterCity] = useState("");
    const [mapCity, setMapCity] = useState("");
    const [page, setPage] = useState(1);

    const hoursText = `${content?.hoursFixedStart ?? "08:00"}${
        content?.hoursSeparator ?? " – "
    }${content?.hoursFixedEnd ?? "16:00"}`;

    useEffect(() => {
        getCities()
            .then((list) => setCities(list || []))
            .catch(() => setCities([]));

        getPoints()
            .then((list) => {
                setPoints(list || []);
                if ((list || []).length) setMapCity(list[0].city);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setPage(1);
        getPoints(filterCity || undefined)
            .then((list) => {
                setPoints(list || []);
                if ((list || []).length) setMapCity(list[0].city);
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

    const prev = () => setPage((p) => Math.max(1, p - 1));
    const next = () => setPage((p) => Math.min(paged.totalPages, p + 1));
    const goTo = (n) => setPage(n);
    const clearFilter = () => setFilterCity("");

    return (
        <>
            <Header />
            <main className="bp-section points">
                <div className="bp-container">
                    <header className="points__head">
                        <h1 className="points__title">
                            {content?.title ?? "Lista punktów krwiodawstwa"}
                        </h1>
                        <p className="points__lead">
                            {content?.lead ?? "Kliknij kafelek, aby zobaczyć lokalizację na mapie."}
                        </p>

                        <div className="points__filters" role="region" aria-label="Filtruj punkty">
                            <div className="points__filter-group">
                                <label className="points__filter-label" htmlFor="cityFilter">
                                    {content?.labels?.cityFilter ?? "Miasto"}
                                </label>
                                <div className="points__select-wrap">
                                    <select
                                        id="cityFilter"
                                        className="points__select"
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                    >
                                        <option value="">{content?.allCities ?? "Wszystkie miasta"}</option>
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
                                className="bp-btn bp-btn--ghost points__clear"
                                onClick={clearFilter}
                                disabled={!filterCity}
                            >
                                Wyczyść
                            </button>
                        </div>
                    </header>

                    <div className="points__layout">
                        {/* KAFELKI */}
                        <section className="points-grid" aria-label="Punkty krwiodawstwa">
                            {paged.items.map((p) => {
                                const isSelected = mapCity === p.city;
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${p.city} ${p.street}`
                                )}`;

                                return (
                                    <article
                                        key={p.id}
                                        className={`bp-card point ${isSelected ? "is-selected" : ""}`}
                                        onClick={() => setMapCity(p.city)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) =>
                                            (e.key === "Enter" || e.key === " ") && setMapCity(p.city)
                                        }
                                    >
                                        <div className="point__head">
                                            <h2 className="point__city">{p.city}</h2>
                                            <span className="point__phone">{p.phone}</span>
                                        </div>

                                        <div className="point__rows">
                                            <div className="point__row">
                        <span className="point__label">
                          {content?.labels?.address ?? "Adres"}
                        </span>
                                                <span className="point__val">
                          {p.street}, {p.zipCode}
                        </span>
                                            </div>

                                            <div className="point__row">
                        <span className="point__label">
                          {content?.labels?.hours ?? "Godziny"}
                        </span>
                                                <span className="point__val point__hours">{hoursText}</span>
                                            </div>
                                        </div>

                                        <div className="point__cta">
                                            <button
                                                type="button"
                                                className="bp-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMapCity(p.city);
                                                }}
                                            >
                                                {content?.buttons?.showOnMap ?? "Pokaż na mapie"}
                                            </button>
                                            <a
                                                className="bp-btn bp-btn--ghost"
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {content?.buttons?.openInGoogleMaps ?? "Otwórz w Google Maps"}
                                            </a>
                                        </div>
                                    </article>
                                );
                            })}

                            {!points.length && (
                                <div className="bp-card point point--empty">
                                    {content?.emptyState ?? "Brak danych do wyświetlenia."}
                                </div>
                            )}
                        </section>

                        {/* MAPA */}
                        <aside className="points__map">
                            {mapCity ? (
                                <Map key={mapCity} city={mapCity} />
                            ) : (
                                <div className="points__map-placeholder">
                                    {content?.mapPlaceholder ?? "Wybierz punkt, aby zobaczyć mapę"}
                                </div>
                            )}
                        </aside>
                    </div>

                    {/* PAGINACJA */}
                    {points.length > PAGE_SIZE && (
                        <nav className="points__pagination" role="navigation" aria-label="Paginacja">
                            <button
                                className="bp-btn bp-btn--ghost"
                                onClick={prev}
                                disabled={paged.page === 1}
                                aria-label={content?.buttons?.prev ?? "Poprzednia"}
                            >
                                {content?.buttons?.prev ?? "Poprzednia"}
                            </button>

                            <ul className="pagination__pages" aria-hidden="true">
                                {Array.from({ length: paged.totalPages }, (_, i) => i + 1).map((n) => (
                                    <li key={n}>
                                        <button
                                            className={`pagination__page ${n === paged.page ? "is-active" : ""}`}
                                            onClick={() => goTo(n)}
                                        >
                                            {n}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="bp-btn bp-btn--ghost"
                                onClick={next}
                                disabled={paged.page === paged.totalPages}
                                aria-label={content?.buttons?.next ?? "Następna"}
                            >
                                {content?.buttons?.next ?? "Następna"}
                            </button>
                        </nav>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
