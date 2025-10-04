import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "./DonorInfoPage.css";
import content from "../../content/DonorInfo/DonorTipsPage.json";

export default function DonorTipsPage() {
    return (
        <>
            <Header />
            <main className="bp-section donor">
                <div className="bp-container">
                    <header className="donor-head">
                        <h1 className="donor-title">{content.title}</h1>
                        <p className="donor-lead">{content.lead}</p>
                        <div className="donor-cta">
                            <a className="bp-btn" href={content.buttons.findPointHref}>
                                {content.buttons.findPoint}
                            </a>
                            <a className="bp-btn bp-btn--ghost" href={content.buttons.backInfoHref}>
                                {content.buttons.backInfo}
                            </a>
                        </div>
                    </header>

                    <section className="donor-grid" aria-label="Porady dla krwiodawcy">
                        {content.cards.map((card) => (
                            <article key={card.title} className="bp-card donor-card">
                                <h2 className="donor-card-title">{card.title}</h2>
                                <ul className="donor-step-list" role="list">
                                    {card.items.map((it, i) => <li key={i}>{it}</li>)}
                                </ul>
                                {card.note ? <p className="donor-card-desc" style={{ marginTop: 10 }}>{card.note}</p> : null}
                            </article>
                        ))}
                    </section>

                    <section className="donor-two-col" aria-label="Praktyczne wskazówki">
                        <article className="bp-card donor-box">
                            <h2 className="donor-box-title">{content.avoid.title}</h2>
                            <ul className="donor-checklist donor-checklist-warn" role="list">
                                {content.avoid.items.map((li, i) => (
                                    <li key={i} className="donor-checklist-item">
                                        <span className="donor-checklist-bullet" aria-hidden="true">!</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="bp-card donor-box">
                            <h2 className="donor-box-title">{content.bring.title}</h2>
                            <ul className="donor-checklist" role="list">
                                {content.bring.items.map((li, i) => (
                                    <li key={i} className="donor-checklist-item">
                                        <span className="donor-checklist-bullet" aria-hidden="true">✓</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    <section className="donor-steps" aria-label="Dzień donacji – krok po kroku">
                        {content.dayOf.map((step, idx) => (
                            <article key={idx} className="bp-card donor-step">
                                <h2 className="donor-step-title">{step.title}</h2>
                                <ul className="donor-step-list" role="list">
                                    {step.items.map((li, i) => <li key={i}>{li}</li>)}
                                </ul>
                            </article>
                        ))}
                    </section>

                    <section className="donor-final bp-card">
                        <h2 className="donor-final-title">{content.final.title}</h2>
                        <p className="donor-final-text">{content.final.text}</p>
                        <div className="donor-cta">
                            <a className="bp-btn" href={content.buttons.findPointHref}>
                                {content.buttons.findPoint}
                            </a>
                            <a className="bp-btn bp-btn--ghost" href={content.buttons.backInfoHref}>
                                {content.buttons.backInfo}
                            </a>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
