import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Box, Paper, Typography, CircularProgress, Alert, Stack } from "@mui/material";
import { getForecastOfBloodDemand } from "../../services/ForecastOfBloodDemandService";

function buildDataset(history, forecast) {
  const map = new Map();

  history.forEach((h) => map.set(h.date, { date: new Date(h.date), history: h.value }));
  forecast.forEach((f) => {
    const prev = map.get(f.date) || { date: new Date(f.date) };
    map.set(f.date, {
      ...prev,
      forecast: f.forecast,
      lower_ci: f.lower_ci,
      upper_ci: f.upper_ci,
    });
  });

  const rows = Array.from(map.values()).sort((a, b) => +a.date - +b.date);
  rows.forEach((r) => {
    if (r.lower_ci != null && r.upper_ci != null) {
      r.ci_base = r.lower_ci;
      r.ci_span = r.upper_ci - r.lower_ci;
    } else {
      r.ci_base = null;
      r.ci_span = null;
    }
  });
  return rows;
}

export default function ForecastChart({ bloodType, province }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await getForecastOfBloodDemand(bloodType, province);
        if (!mounted) return;
        setMeta(res.meta || null);
        setRows(buildDataset(res.history || [], res.forecast || []));
      } catch {
        if (!mounted) return;
        setError("Nie udało się pobrać danych.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [bloodType, province]);

  return (
    <Paper elevation={2} sx={{ p: 3, width: "100%", mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Prognoza zapotrzebowania: {bloodType} / {province}
        </Typography>
        {meta ? (
          <Typography variant="body2" color="text.secondary">
            Przedział niepewności: {Math.round((meta.interval_width || 0) * 100)}%
          </Typography>
        ) : null}
      </Stack>

      {loading ? (
        <Box py={8} textAlign="center">
          <CircularProgress />
        </Box>
      ) : null}

      {!loading && error ? <Alert severity="error">{error}</Alert> : null}

      {!loading && !error && rows.length === 0 ? (
        <Alert severity="info">Brak danych dla wybranych parametrów.</Alert>
      ) : null}

      {!loading && !error && rows.length > 0 ? (
        <Box sx={{ height: 420 }}>
          <LineChart
            height={400}
            dataset={rows}
            xAxis={[
              {
                dataKey: "date",
                scaleType: "time",
                label: "Data",
                valueFormatter: (v) => (v instanceof Date ? v.toISOString().slice(0, 7) : v),
              },
            ]}
            series={[
              { dataKey: "history", label: "Historia", showMark: false, color: "#FFA500" },
              { dataKey: "forecast", label: "Prognoza", showMark: false, strokeDasharray: "6 4", color: "#1f77b4" },
              { dataKey: "ci_base", area: true, color: "transparent", showMark: false, stack: "ci" },
              { dataKey: "ci_span", label: "Przedział ufności", area: true, color: "rgba(100,149,237,0.15)", showMark: false, stack: "ci" },
            ]}
            margin={{ top: 10, right: 20, bottom: 40, left: 50 }}
            grid={{ horizontal: true, vertical: true }}
            slotProps={{
              legend: { direction: "row", position: { vertical: "bottom", horizontal: "middle" } },
            }}
          />
        </Box>
      ) : null}
    </Paper>
  );
}
