import "./KitchenDashboard.css";

export default function KitchenDashboard() {
  return (
    <div className="kitchen-page">
      <h2 className="kitchen-title">Kitchen Dashboard</h2>

      <div className="kitchen-board">
        <div className="kitchen-column">
          <div className="column-header">Pending Confirmation</div>
        </div>

        <div className="kitchen-column">
          <div className="column-header">Ready To Prepare</div>
        </div>

        <div className="kitchen-column">
          <div className="column-header">Ready For Service</div>
        </div>
      </div>
    </div>
  );
}
