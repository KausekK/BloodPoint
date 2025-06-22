export default function VisitTable({ visits }) {
  if (visits.length === 0) {
    return <div className="no-data">Brak historii wizyt</div>;
  }

  return (
    <table className="visit-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Typ donacji</th>
          <th>Ilość krwi</th>
          <th>Miasto</th>
          <th>Ulica</th>
        </tr>
      </thead>
      <tbody>
        {visits.map((v, idx) => (
          <tr key={v.id} className={idx % 2 ? "striped" : ""}>
            <td>{new Date(v.donationDate).toLocaleDateString()}</td>
            <td>{v.donationType.replace("_", " ").toLowerCase()}</td>
            <td>{v.amountOfBlood} ml</td>
            <td>{v.city}</td>
            <td>{v.street}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
