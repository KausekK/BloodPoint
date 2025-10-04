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

    const labels = content && content.labels ? content.labels : {};
    const buttons = content && content.buttons ? content.buttons : {};

    const hoursText =
        (content && content.hoursFixedStart ? content.hoursFixedStart : "08:00") +
        (content && content.hoursSeparator ? content.hoursSeparator : " – ") +
        (content && content.hoursFixedEnd ? content.hoursFixedEnd : "16:00");

    useEffect(function loadInitial() {
        getCities()
            .then(function (list) { setCities(Array.isArray(list) ? list : []); })
            .catch(function () { setCities([]); });

        getPoints()
            .then(function (list) {
                const data = Array.isArray(list) ? list : [];
                setPoints(data);
                if (data.length > 0) setMapCity(data[0].city);
            })
            .catch(function (e) { console.error(e); });
    }, []);

    useEffect(function reloadWhenFilterChanges() {
        setPage(1);
        getPoints(filterCity || undefined)
            .then(function (list) {
                const data = Array.isArray(list) ? list : [];
                setPoints(data);
                if (data.length > 0) setMapCity(data[0].city);
            })
            .catch(function (e) { console.error(e); });
    }, [filterCity]);

    const paged = useMemo(function () {
        const totalPages = Math.max(1, Math.ceil(points.length / PAGE_SIZE));
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * PAGE_SIZE;
        return {
            items: points.slice(start, start + PAGE_SIZE),
            totalPages: totalPages,
            page: safePage,
        };
    }, [points, page]);

    function prev() { setPage(function (p) { return Math.max(1, p - 1); }); }
    function next() { setPage(function (p) { return Math.min(paged.totalPages, p + 1); }); }
    function goTo(n) { setPage(n); }
    function clearFilter() { setFilterCity(""); }

    return (
        <>
            <Header />
            <main className="bp-section points">
                <div className="bp-container">
                    <header className="points-head">
                        <h1 className="points-title">
                            {content && content.title ? content.title : "Lista punktów krwiodawstwa"}
                        </h1>
                        <p className="points-lead">
                            {content && content.lead ? content.lead : "Kliknij kafelek, aby zobaczyć lokalizację na mapie."}
                        </p>

                        <div className="points-filters">
                            <div className="filter-group">
                                <label className="filter-label" htmlFor="cityFilter">
                                    {labels && labels.cityFilter ? labels.cityFilter : "Miasto"}
                                </label>
                                <div className="select-wrap">
                                    <select
                                        id="cityFilter"
                                        className="select"
                                        value={filterCity}
                                        onChange={function (e) { setFilterCity(e.target.value); }}
                                    >
                                        <option value="">
                                            {content && content.allCities ? content.allCities : "Wszystkie miasta"}
                                        </option>
                                        {cities.map(function (c) {
                                            return <option key={c} value={c}>{c}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="bp-btn bp-btn--ghost clear-btn"
                                onClick={clearFilter}
                                disabled={!filterCity}
                            >
                                Wyczyść
                            </button>
                        </div>
                    </header>

                    <div className="points-layout">
                        <section className="points-grid" aria-label="Punkty krwiodawstwa">
                            {paged.items.map(function (p) {
                                var isSelected = mapCity === p.city;
                                var mapsUrl =
                                    "https://www.google.com/maps/search/?api=1&query=" +
                                    encodeURIComponent(p.city + " " + p.street);

                                return (
                                    <article
                                        key={p.id}
                                        className={"bp-card point " + (isSelected ? "is-selected" : "")}
                                        onClick={function () { setMapCity(p.city); }}
                                        tabIndex={0}
                                        onKeyDown={function (e) {
                                            if (e.key === "Enter" || e.key === " ") { setMapCity(p.city); }
                                        }}
                                    >
                                        <div className="point-head">
                                            <h2 className="point-city">{p.city}</h2>
                                            <span className="point-phone">{p.phone}</span>
                                        </div>

                                        <div className="point-rows">
                                            <div className="point-row">
                                                <span className="point-label">{labels && labels.address ? labels.address : "Adres"}</span>
                                                <span className="point-val">{p.street}, {p.zipCode}</span>
                                            </div>

                                            <div className="point-row">
                                                <span className="point-label">{labels && labels.hours ? labels.hours : "Godziny"}</span>
                                                <span className="point-val point-hours">{hoursText}</span>
                                            </div>
                                        </div>

                                        <div className="point-cta">
                                            <button
                                                type="button"
                                                className="bp-btn"
                                                onClick={function (e) { e.stopPropagation(); setMapCity(p.city); }}
                                            >
                                                {buttons && buttons.showOnMap ? buttons.showOnMap : "Pokaż na mapie"}
                                            </button>
                                            <a
                                                className="bp-btn bp-btn--ghost"
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={function (e) { e.stopPropagation(); }}
                                            >
                                                {buttons && buttons.openInGoogleMaps ? buttons.openInGoogleMaps : "Otwórz w Google Maps"}
                                            </a>
                                        </div>
                                    </article>
                                );
                            })}

                            {points.length === 0 && (
                                <div className="bp-card point point-empty">
                                    {content && content.emptyState ? content.emptyState : "Brak danych do wyświetlenia."}
                                </div>
                            )}
                        </section>

                        <aside className="points-map">
                            {mapCity ? (
                                <Map key={mapCity} city={mapCity} />
                            ) : (
                                <div className="map-placeholder">
                                    {content && content.mapPlaceholder ? content.mapPlaceholder : "Wybierz punkt, aby zobaczyć mapę"}
                                </div>
                            )}
                        </aside>
                    </div>

                    {points.length > PAGE_SIZE && (
                        <nav className="points-pagination">
                            <button
                                className="bp-btn bp-btn--ghost"
                                onClick={prev}
                                disabled={paged.page === 1}
                            >
                                {buttons && buttons.prev ? buttons.prev : "Poprzednia"}
                            </button>

                            <ul className="pages" aria-hidden="true">
                                {Array.from({ length: paged.totalPages }, function (_, i) { return i + 1; }).map(function (n) {
                                    return (
                                        <li key={n}>
                                            <button
                                                className={"page " + (n === paged.page ? "is-active" : "")}
                                                onClick={function () { goTo(n); }}
                                            >
                                                {n}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <button
                                className="bp-btn bp-btn--ghost"
                                onClick={next}
                                disabled={paged.page === paged.totalPages}
                            >
                                {buttons && buttons.next ? buttons.next : "Następna"}
                            </button>
                        </nav>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
