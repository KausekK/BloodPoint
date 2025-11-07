import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "../../components/SharedCSS/InfoPagesCommon.css"
import content from "../../content/DonorInfo/DonorTipsPage.json";

export default function DonorTipsPage() {
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
              <a className="bp-btn bp-btn--ghost" href={content.buttons.backInfoHref}>
                {content.buttons.backInfo}
              </a>
            </div>
          </header>

          <section className="info-grid">
            {content.cards.map((card) => (
              <article key={card.title} className="bp-card donor-card">
                <h2>{card.title}</h2>
                <ul>
                  {card.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
                {card.note && <p>{card.note}</p>}
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
