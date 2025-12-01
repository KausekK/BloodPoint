import "leaflet/dist/leaflet.css";
import PlaceIcon from "@mui/icons-material/Place";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { renderToString } from "react-dom/server";
import L, { point } from "leaflet";
import { divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./Map.css";

const svg = renderToString(<PlaceIcon />)
  .replace("<svg", '<svg style="width:32px;height:32px;color:#f00;fill:#f00"')
  .replace(/<path /g, '<path fill="#f00" ');

export const muiIcon = L.divIcon({
  html: svg,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const createClusterCustomIcon = (cluster) => {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

function isValidCoord(value) {
  const n = Number(value);
  return Number.isFinite(n);
}

export default function Map({ points = [], selectedPointId }) {
  if (!Array.isArray(points)) {
    points = [];
  }

  const validPoints = points.filter(
    (p) => isValidCoord(p.latitude) && isValidCoord(p.longitude)
  );

  if (validPoints.length === 0) {
    return (
      <div className="map-placeholder">
        Brak poprawnych współrzędnych punktów do wyświetlenia na mapie.
      </div>
    );
  }

  let selectedPoint = validPoints[0];

  if (selectedPointId != null && selectedPointId !== "") {
    const found = validPoints.find(
      (p) => String(p.id) === String(selectedPointId)
    );
    if (found) {
      selectedPoint = found;
    }
  }

  const center = [
    Number(selectedPoint.latitude),
    Number(selectedPoint.longitude),
  ];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution="Google Maps"
        url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {validPoints.map((p) => (
          <Marker
            key={p.id}
            position={[Number(p.latitude), Number(p.longitude)]}
            icon={muiIcon}
          >
            <Popup>
              <strong>{p.city}</strong>
              <br />
              {p.street}, {p.zipCode}
              <br />
              tel. {p.phone}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
