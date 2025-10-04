import { useEffect, useState } from "react";
import "./ForecastOfBloodDemand.css";
import ForecastChart from "./Chart";
import { getHospitalsProvinces } from "../../services/HospitalService";
import { showError } from "../shared/services/MessageService";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];

export default function ForecastOfBloodDemand() {
  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [bloodType, setBloodType] = useState("");

  useEffect(() => {
    getHospitalsProvinces()
        .then((list) => setProvinces(list || []))
        .catch(() => showError("Błąd przy pobieraniu województw"));
  }, []);

  return (
      <div className="page forecast">
        <div className="page-top-bar" />
        <div className="page-content">
          <h1 className="page-heading">Prognoza zapotrzebowania na krew</h1>

          <div className="forecast-filters">
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="province-label">Województwo</InputLabel>
              <Select
                  labelId="province-label"
                  value={province}
                  label="Województwo"
                  onChange={(e) => setProvince(e.target.value)}
              >
                {provinces.map((p, i) => (
                    <MenuItem key={i} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="blood-type-label">Typ krwi</InputLabel>
              <Select
                  labelId="blood-type-label"
                  value={bloodType}
                  label="Typ krwi"
                  onChange={(e) => setBloodType(e.target.value)}
              >
                {bloodTypes.map((bt, i) => (
                    <MenuItem key={i} value={bt}>{bt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {province && bloodType ? (
              <div className="forecast-chart">
                <ForecastChart bloodType={bloodType} province={province} />
              </div>
          ) : (
              <p className="text-helper">Proszę wybrać województwo oraz typ krwi.</p>
          )}
        </div>
      </div>
  );
}
