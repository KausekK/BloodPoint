import CTA from "../CTA/CTA";
import "./GeneralDashboardPanel.css";
import BackButton from "../BackButton/BackButton"

export default function GeneralDashboardPanel({
    title,
    subtitle,
    actions = [],
    center = true,
    className = "",
  }) {
    return (
      <><BackButton to="/" label="Powrót do strony głównej" />
      <section
        className={`panel-dashboard ${center ? "is-centered" : ""} ${className}`}
        aria-label="Panel"
      >
        <header className="panel-head">
          {title && <h1 className="panel-title">{title}</h1>}
          {subtitle && <p className="panel-lead">{subtitle}</p>}
        </header>
  
        <div className="panel-actions">
          {actions.map((a, i) => {
            const isGhost = a.variant === "ghost";
            if (a.to) {
              return <CTA key={i} to={a.to} label={a.label} className={`panel-cta ${isGhost ? "is-ghost" : ""}`} />;
            }
            if (a.href) {
              return (
                <a
                  key={i}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cta panel-cta ${isGhost ? "is-ghost" : ""}`}
                >
                  {a.label}
                </a>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={a.onClick}
                className={`bp-btn panel-btn ${isGhost ? "bp-btn--ghost" : ""}`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </section>
      </>
    );
  }