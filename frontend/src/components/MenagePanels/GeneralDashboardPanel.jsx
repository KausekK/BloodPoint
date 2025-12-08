import CTA from "../CTA/CTA";
import "./GeneralDashboardPanel.css";
import BackButton from "../BackButton/BackButton";

export default function GeneralDashboardPanel({
  title,
  subtitle,
  actions,
  center,
  className,
  backTo = null,
  backLabel = "Powrót",
}) {
  const isCentered = center !== false;
  const list = Array.isArray(actions) ? actions : [];
  const extraClass = className ? " " + className : "";
  const sectionClass = "panel-dashboard" + (isCentered ? " is-centered" : "") + extraClass;

  function renderAction(action, index) {
    const isGhost = action.variant === "ghost";

    if (action.to) {
      const actionClass = "panel-cta" + (isGhost ? " is-ghost" : "");
      return (
        <CTA
          key={index}
          to={action.to}
          label={action.label}
          className={actionClass}
        />
      );
    }

    if (action.href) {
      const linkClass = "cta panel-cta" + (isGhost ? " is-ghost" : "");
      return (
        <a
          key={index}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {action.label}
        </a>
      );
    }

    const btnClass =
      "bp-btn panel-btn" + (isGhost ? " bp-btn--ghost" : "");

    return (
      <button
        key={index}
        type="button"
        onClick={action.onClick}
        className={btnClass}
      >
        {action.label}
      </button>
    );
  }

  return (
    <>
      <BackButton to={backTo} label={backLabel} />
      <section className={sectionClass} aria-label="Panel">
        <header className="panel-head">
          {title && <h1 className="panel-title">{title}</h1>}
          {subtitle && <p className="panel-lead">{subtitle}</p>}
        </header>

        <div className="panel-actions">
          {list.map(renderAction)}
        </div>
      </section>
    </>
  );
}
