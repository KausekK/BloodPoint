import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import { getPoints } from "../../services/BloodDonationPointService";
import Map from "../Map/Map";
import "./DonationPointsPage.css";
import content from "../../data/DonationPoints/DonationPoints.json";

export default function DonationPointsPage() {
    const [points, setPoints] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        getPoints()
            .then((list) => {
                setPoints(list || []);
                if (list?.length) setSelectedCity(list[0].city);
            })
            .catch(console.error);
    }, []);

    const hoursText = `${content.hoursFixedStart}${content.hoursSeparator}${content.hoursFixedEnd}`;

    return (
        <>
            <Header />
            <main className="bp-section points">
                <div className="bp-container">
                    <header className="points__head">
                        <h1 className="points__title">{content.title}</h1>
                        <p className="points__lead">{content.lead}</p>
                    </header>

                    <div className="points__layout">
                        <section className="points-grid" aria-label="Punkty krwiodawstwa">
                            {points.map((p) => {
                                const isSelected = selectedCity === p.city;
                                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${p.city} ${p.street}`
                                )}`;

                                return (
                                    <article
                                        key={p.id}
                                        className={`bp-card point ${isSelected ? "is-selected" : ""}`}
                                        onClick={() => setSelectedCity(p.city)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedCity(p.city)}
                                    >
                                        <div className="point__head">
                                            <h2 className="point__city">{p.city}</h2>
                                            <span className="point__phone">{p.phone}</span>
                                        </div>

                                        <div className="point__rows">
                                            <div className="point__row">
                                                <span className="point__label">{content.labels.address}</span>
                                                <span className="point__val">
                          {p.street}, {p.zipCode}
                        </span>
                                            </div>

                                            <div className="point__row">
                                                <span className="point__label">{content.labels.hours}</span>
                                                <span className="point__val point__hours">{hoursText}</span>
                                            </div>
                                        </div>

                                        <div className="point__cta">
                                            <button
                                                type="button"
                                                className="bp-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCity(p.city);
                                                }}
                                            >
                                                {content.buttons.showOnMap}
                                            </button>
                                            <a
                                                className="bp-btn bp-btn--ghost"
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {content.buttons.openInGoogleMaps}
                                            </a>
                                        </div>
                                    </article>
                                );
                            })}

                            {!points.length && (
                                <div className="bp-card point point--empty">{content.emptyState}</div>
                            )}
                        </section>

                        <aside className="points__map">
                            {selectedCity ? (
                                <Map key={selectedCity} city={selectedCity} />
                            ) : (
                                <div className="points__map-placeholder">{content.mapPlaceholder}</div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
