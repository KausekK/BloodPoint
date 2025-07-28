import { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ForecastChart from "./Chart";
import "./ForecastOfBloodDemand.css";
import { getHospitalsProvinces } from "../../services/HospitalService";
import { showError } from "../shared/services/MessageService";

export default function ForecastOfBloodDemand() {
  const [province, setProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [bloodType, setBloodType] = useState("");
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"];

  const handleProvinceChange = (event) => {
    setProvince(event.target.value);
  };

  const handleBloodTypeChange = (event) => {
    setBloodType(event.target.value);
  };

  useEffect(() => {
    getHospitalsProvinces()
      .then(setProvinces)
      .catch(() => {
        showError("Błąd przy pobieraniu województw");
      });
  }, []);

  return (
    <div className="page forecast">
      <div className="page__top-bar" />
      <div className="page__content">
        <h1 className="page__heading">
          Prognoza zapotrzebowania na krew
        </h1>

        <div className="forecast__filters" style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="cat-label">Województwo</InputLabel>
            <Select
              labelId="cat-label"
              value={province}
              label="Województwo"
              onChange={handleProvinceChange}
            >
              {provinces.map((p, index) => (
                <MenuItem key={index} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="blood-type-label">Typ krwi</InputLabel>
            <Select
              labelId="blood-type-label"
              value={bloodType}
              label="Typ krwi"
              onChange={handleBloodTypeChange}
            >
              {bloodTypes.map((bt, index) => (
                <MenuItem key={index} value={bt}>
                  {bt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {province && bloodType ? (
          <div className="forecast__chart-wrapper">
            <ForecastChart bloodType={bloodType} province={province} />
          </div>
        ) : (
          <p className="text-helper">Proszę wybrać województwo oraz typ krwi.</p>
        )}
      </div>
    </div>
  );
}
