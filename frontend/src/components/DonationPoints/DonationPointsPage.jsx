import { useEffect, useState } from "react";
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
  const [selectedPointId, setSelectedPointId] = useState(null);
  const [page, setPage] = useState(1);

  let labels = {};
  if (content && content.labels) {
    labels = content.labels;
  }

  let buttons = {};
  if (content && content.buttons) {
    buttons = content.buttons;
  }

  let hoursStart = content.hoursFixedStart;
  if (hoursStart === null || hoursStart === undefined) {
    hoursStart = "08:00";
  }

  let hoursEnd = content.hoursFixedEnd;
  if (hoursEnd === null || hoursEnd === undefined) {
    hoursEnd = "16:00";
  }

  let hoursSeparator = content.hoursSeparator;
  if (hoursSeparator === null || hoursSeparator === undefined) {
    hoursSeparator = " – ";
  }

  const hoursText = hoursStart + hoursSeparator + hoursEnd;

  useEffect(function () {
    getCities()
      .then(function (list) {
        setCities(list);
      })
      .catch(function () {
        setCities([]);
      });

      getPoints()
      .then(function (list) {
        setPoints(list);
        if (list.length > 0) {
          setSelectedPointId(list[0].id);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  useEffect(
    function () {
      setPage(1);

      let cityParam;
      if (filterCity && filterCity.trim() !== "") {
        cityParam = filterCity;
      } else {
        cityParam = undefined;
      }

      getPoints(cityParam)
        .then(function (list) {
          setPoints(list);
          if (list.length > 0) {
            setSelectedPointId(list[0].id);
          } else {
            setSelectedPointId(null);
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    [filterCity]
  );

  const totalPages = Math.max(1, Math.ceil(points.length / PAGE_SIZE));
  const currentPage = page > totalPages ? totalPages : page;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const itemsOnPage = points.slice(startIndex, startIndex + PAGE_SIZE);

  function handlePrev() {
    setPage(function (prevPage) {
      if (prevPage <= 1) {
        return 1;
      }
      return prevPage - 1;
    });
  }

  function handleNext() {
    setPage(function (prevPage) {
      return prevPage + 1;
    });
  }

  function handleCityFilterChange(event) {
    setFilterCity(event.target.value);
  }

  function handleClearFilter() {
    setFilterCity("");
  }

  function handleCardClick(point) {
    setSelectedPointId(point.id);
  }
  
  function handleShowOnMapClick(event, point) {
    event.stopPropagation();
    setSelectedPointId(point.id);
  }

  function handleOpenMapsClick(event) {
    event.stopPropagation();
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
                    onChange={handleCityFilterChange}
                  >
                    <option value="">
                      {content.allCities || "Wszystkie miasta"}
                    </option>
                    {cities.map(function (city) {
                      return (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="bp-btn bp-btn--ghost clear-btn"
                onClick={handleClearFilter}
                disabled={!filterCity}
              >
                Wyczyść
              </button>
            </div>
          </header>

          <div className="points-layout">
            <section className="points-grid" aria-label="Punkty krwiodawstwa">
              {itemsOnPage.map(function (point) {
                const isSelected = selectedPointId === point.id;
                const mapsUrl =
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(point.city + " " + point.street);

                return (
                  <article
                    key={point.id}
                    className={
                      "bp-card point" + (isSelected ? " is-selected" : "")
                    }
                    onClick={function () {
                      handleCardClick(point);
                    }}
                    tabIndex={0}
                  >
                    <div className="point-head">
                      <h2 className="point-city">{point.city}</h2>
                      <span className="point-phone">{point.phone}</span>
                    </div>

                    <div className="point-rows">
                      <div className="point-row">
                        <span className="point-label">
                          {labels.address || "Adres"}
                        </span>
                        <span className="point-val">
                          {point.street}, {point.zipCode}
                        </span>
                      </div>
                      <div className="point-row">
                        <span className="point-label">
                          {labels.hours || "Godziny"}
                        </span>
                        <span className="point-val point-hours">
                          {hoursText}
                        </span>
                      </div>
                    </div>

                    <div className="point-cta info-cta">
                      <button
                        type="button"
                        className="bp-btn"
                        onClick={function (event) {
                          handleShowOnMapClick(event, point);
                        }}
                      >
                        {buttons.showOnMap || "Pokaż na mapie"}
                      </button>
                      <a
                        className="bp-btn bp-btn--ghost"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleOpenMapsClick}
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
              {points.length > 0 ? (
                <Map
                  key={selectedPointId || "no-point"}
                  points={points}
                  selectedPointId={selectedPointId}
                />
              ) : (
                <div className="map-placeholder">
                  {content.mapPlaceholder || "Brak punktów do wyświetlenia na mapie."}
                </div>
              )}
            </aside>
          </div>

          {points.length > PAGE_SIZE && (
            <nav className="points-pagination">
              <button
                className="bp-btn bp-btn--ghost"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                {buttons.prev || "Poprzednia"}
              </button>
              <ul className="pages">
                {Array.from({ length: totalPages }, function (_, index) {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;

                  return (
                    <li key={pageNumber}>
                      <button
                        className={
                          "page" + (isActive ? " is-active" : "")
                        }
                        onClick={function () {
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                className="bp-btn bp-btn--ghost"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
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
