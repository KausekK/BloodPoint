import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "../../components/SharedCSS/InfoPagesCommon.css";
import content from "../../content/DonorInfo/DonorInfoPage.json";

export default function DonorInfoPage() {
  const title = content.title;
  const lead = content.lead;
  const buttons = content.buttons || {};
  const cards = content.cards || [];
  const eligibility = content.eligibility || { title: "", items: [] };
  const contras = content.contras || { title: "", items: [] };

  return (
    <>
      <Header />
      <main className="bp-section info-page donor">
        <div className="bp-container">
          <header className="info-head">
            <h1 className="info-title">{title}</h1>
            <p className="info-lead">{lead}</p>
            <div className="info-cta">
              <a className="bp-btn" href={buttons.findPointHref}>
                {buttons.findPoint}
              </a>
              <a className="bp-btn bp-btn--ghost" href={buttons.eligibilityHref}>
                {buttons.eligibility}
              </a>
            </div>
          </header>

          <section className="info-grid">
            {cards.map(function (card) {
              const hasLink = card.link && card.link.href;

              return (
                <article key={card.title} className="bp-card donor-card">
                  <h2>{card.title}</h2>
                  <p>{card.desc}</p>
                  {hasLink && (
                    <a className="bp-btn bp-btn--ghost" href={card.link.href}>
                      {card.link.label}
                    </a>
                  )}
                </article>
              );
            })}
          </section>

          <section className="info-two-col">
            <article className="bp-card donor-box">
              <h2>{eligibility.title}</h2>
              <ul className="donor-checklist">
                {eligibility.items.map(function (item, index) {
                  return <li key={index}>✓ {item}</li>;
                })}
              </ul>
            </article>

            <article className="bp-card donor-box">
              <h2>{contras.title}</h2>
              <ul className="donor-checklist donor-checklist-warn">
                {contras.items.map(function (item, index) {
                  return <li key={index}>! {item}</li>;
                })}
              </ul>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
