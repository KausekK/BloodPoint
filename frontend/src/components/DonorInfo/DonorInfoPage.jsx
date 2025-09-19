import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import "./DonorInfoPage.css";
import content from "../../data/DonorInfo/DonorInfoPage.json";

export default function DonorInfoPage() {
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
                            <a className="bp-btn bp-btn--ghost" href={content.buttons.eligibilityHref}>
                                {content.buttons.eligibility}
                            </a>
                        </div>
                    </header>

                    <section className="donor__grid" aria-label="Skróty informacji">
                        {content.cards.map((card) => (
                            <article key={card.title} className="bp-card donor-card">
                                <h2 className="donor-card__title">{card.title}</h2>
                                <p className="donor-card__desc">{card.desc}</p>
                                {card.link && (
                                    <a className="bp-btn bp-btn--ghost" href={card.link.href}>
                                        {card.link.label}
                                    </a>
                                )}
                            </article>
                        ))}
                    </section>

                    <section id="kto-moze" className="donor__two-col">
                        <article className="bp-card donor-box">
                            <h2 className="donor-box__title">{content.eligibility.title}</h2>
                            <ul className="donor-checklist" role="list">
                                {content.eligibility.items.map((li, i) => (
                                    <li key={i} className="donor-checklist__item">
                                        <span className="donor-checklist__bullet" aria-hidden="true">✓</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>

                        <article className="bp-card donor-box">
                            <h2 className="donor-box__title">{content.contras.title}</h2>
                            <ul className="donor-checklist donor-checklist--warn" role="list">
                                {content.contras.items.map((li, i) => (
                                    <li key={i} className="donor-checklist__item">
                                        <span className="donor-checklist__bullet" aria-hidden="true">!</span>
                                        <span>{li}</span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    </section>

                    <section className="donor__steps" aria-label="Wskazówki krok po kroku">
                        {content.steps.map((step, idx) => (
                            <article key={idx} className="bp-card donor-step">
                                <h2 className="donor-step__title">{step.title}</h2>
                                <ul className="donor-step__list" role="list">
                                    {step.items.map((li, i) => <li key={i}>{li}</li>)}
                                </ul>
                            </article>
                        ))}
                    </section>

                    <section className="donor__final bp-card">
                        <h2 className="donor__final-title">{content.final.title}</h2>
                        <p className="donor__final-text">{content.final.text}</p>
                        <div className="donor__cta">
                            <a className="bp-btn" href={content.buttons.findPointHref}>
                                {content.buttons.findPoint}
                            </a>
                            <a className="bp-btn bp-btn--ghost" href={content.buttons.tipsHref}>
                                {content.buttons.tips}
                            </a>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
