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

export default function Map({ city }) {
  //TODO zmienić na dynamiczne pobieranie z backendu jak beda dane w bazie
  const markers = [
    {
      geocode: [52.232748, 21.060196],
      popup: "RCKiK Warszawa – ul. Saska 63/75",
    },
    {
      geocode: [52.225769, 21.001981],
      popup: "OT RCKiK – ul. Nowogrodzka 59, Warszawa",
    },
    {
      geocode: [52.20713, 21.191227],
      popup: "OT RCKiK – al. Dzieci Polskich 20, Warszawa",
    },
    {
      geocode: [50.0588, 19.9555],
      popup: "Regionalne Centrum Krwiodawstwa i Krwiolecznictwa , Kraków",
    },
  ];
  
  const citiesCoords = {
    Warszawa: [52.2297, 21.0122],
    Kraków: [50.0614, 19.9366],
    Wrocław: [51.1079, 17.0385],
    Gdańsk: [54.352, 18.6466],
    Poznań: [52.4064, 16.9252],
    Łódź: [51.7592, 19.455],
    Rzeszów: [50.0413, 21.999],
    Szczecin: [53.4289, 14.553],
    Toruń: [53.0138, 18.5984],
    Bydgoszcz: [53.1235, 18.0084],
    Białystok: [53.1325, 23.1688],
    Katowice: [50.2649, 19.0238],
    Olsztyn: [53.7784, 20.4801],
  };

  const createClusterCustomIcon = function (cluster) {
    return new divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  return (
    <MapContainer
      center={citiesCoords[city] || [52.2297, 21.0122]}
      zoom={13}
      style={{ height: "70vh", width: "80%" }}
    >
      {
        <TileLayer
          attribution="Google Maps"
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
      }

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {markers.map((m, i) => (
          <Marker key={i} position={m.geocode} icon={muiIcon}>
            <Popup>{m.popup}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
