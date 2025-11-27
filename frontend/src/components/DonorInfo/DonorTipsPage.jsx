import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "../../components/SharedCSS/InfoPagesCommon.css";
import content from "../../content/DonorInfo/DonorTipsPage.json";

export default function DonorTipsPage() {
  const title = content.title;
  const lead = content.lead;
  const buttons = content.buttons || {};
  const cards = content.cards || [];

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
              <a className="bp-btn bp-btn--ghost" href={buttons.backInfoHref}>
                {buttons.backInfo}
              </a>
            </div>
          </header>

          <section className="info-grid">
            {cards.map(function (card) {
              return (
                <article key={card.title} className="bp-card donor-card">
                  <h2>{card.title}</h2>
                  <ul>
                    {card.items.map(function (item, index) {
                      return <li key={index}>{item}</li>;
                    })}
                  </ul>
                  {card.note && <p>{card.note}</p>}
                </article>
              );
            })}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
