import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "./DonorInfoPage.css";
import content from "../../data/DonorInfo/DonorTipsPage.json";

export default function DonorTipsPage() {
    return (
        <>
            <Header />
            <main className="bp-section donor">
                <div className="bp-container">
                    <header className="donor__head">
                        <h1 className="donor__title">{content.title}</h1>
                        <p className="donor__lead">{content.lead}</p>
                        <div className="donor__cta">
                            <a className="bp-btn" href={content.buttons.findPointHref}>
                                {content.buttons.findPoint}
                            </a>
                            <a className="bp-btn bp-btn--ghost" href={content.buttons.backInfoHref}>
                                {content.buttons.backInfo}
                            </a>
                        </div>
                    </header>

                    {/* Sekcje porad w kartach */}
                    <section className="donor__grid" aria-label="Porady dla krwiodawcy">
                        {content.cards.map((card) => (
                            <article key={card.title} className="bp-card donor-card">
                                <h2 className="donor-card__title">{card.title}</h2>
                                <ul className="donor-step__list" role="list">
                                    {card.items.map((it, i) => <li key={i}>{it}</li>)}
                                </ul>
                                {card.note && <p className="donor-card__desc" style={{marginTop: 10}}>{card.note}</p>}
                            </article>
                        ))}
                    </section>

                    {/* Dwie kolumny: czego unikać / co zabrać */}
                    <section className="donor__two-col" aria-label="Praktyczne wskazówki">
                        <article className="bp-card donor-box">
                            <h2 className="donor-box__title">{content.avoid.title}</h2>
                            <ul className="donor-checklist donor-checklist--warn" role="list">
                                {content.avoid.items.map((li, i) => (
                                    <li key={i} className="donor-checklist__item">
                                        <span className="donor-checklist__bullet" aria-hidden="true">!</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="bp-card donor-box">
                            <h2 className="donor-box__title">{content.bring.title}</h2>
                            <ul className="donor-checklist" role="list">
                                {content.bring.items.map((li, i) => (
                                    <li key={i} className="donor-checklist__item">
                                        <span className="donor-checklist__bullet" aria-hidden="true">✓</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    {/* Kroki dnia donacji */}
                    <section className="donor__steps" aria-label="Dzień donacji – krok po kroku">
                        {content.dayOf.map((step, idx) => (
                            <article key={idx} className="bp-card donor-step">
                                <h2 className="donor-step__title">{step.title}</h2>
                                <ul className="donor-step__list" role="list">
                                    {step.items.map((li, i) => <li key={i}>{li}</li>)}
                                </ul>
                            </article>
                        ))}
                    </section>

                    {/* CTA końcowe */}
                    <section className="donor__final bp-card">
                        <h2 className="donor__final-title">{content.final.title}</h2>
                        <p className="donor__final-text">{content.final.text}</p>
                        <div className="donor__cta">
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
