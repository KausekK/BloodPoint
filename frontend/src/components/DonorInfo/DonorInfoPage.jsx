import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "../../components/SharedCSS/InfoPagesCommon.css"
import content from "../../content/DonorInfo/DonorInfoPage.json";

export default function DonorInfoPage() {
  return (
    <>
      <Header />
      <main className="bp-section info-page donor">
        <div className="bp-container">
          <header className="info-head">
            <h1 className="info-title">{content.title}</h1>
            <p className="info-lead">{content.lead}</p>
            <div className="info-cta">
              <a className="bp-btn" href={content.buttons.findPointHref}>
                {content.buttons.findPoint}
              </a>
              <a className="bp-btn bp-btn--ghost" href={content.buttons.eligibilityHref}>
                {content.buttons.eligibility}
              </a>
            </div>
          </header>

          <section className="info-grid">
            {content.cards.map((card) => (
              <article key={card.title} className="bp-card donor-card">
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
                {card.link && (
                  <a className="bp-btn bp-btn--ghost" href={card.link.href}>
                    {card.link.label}
                  </a>
                )}
              </article>
            ))}
          </section>

          <section className="info-two-col">
            <article className="bp-card donor-box">
              <h2>{content.eligibility.title}</h2>
              <ul className="donor-checklist">
                {content.eligibility.items.map((li, i) => (
                  <li key={i}>✓ {li}</li>
                ))}
              </ul>
            </article>

            <article className="bp-card donor-box">
              <h2>{content.contras.title}</h2>
              <ul className="donor-checklist donor-checklist-warn">
                {content.contras.items.map((li, i) => (
                  <li key={i}>! {li}</li>
                ))}
              </ul>
            </article>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
