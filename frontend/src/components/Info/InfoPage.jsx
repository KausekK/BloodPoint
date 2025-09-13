import "./InfoPage.css";
import Footer from "../Footer/Footer";
import Header from "../../components/Header/Header";
import bgImage from "../../assets/zdj6.png";

import CTA from "../../components/CTA/CTA";
import SectionHeading from "../../components/SectionHeading/SectionHeading";

import { useEffect, useState } from "react";
import { getBloodStock } from "../../services/BloodStockService";
import { MAX_CAPACITY } from "../../constants/bloodCapacities";
import content from "../../data/Info/Info.json";

function toFillPercent(bloodGroup, totalFree) {
    const max = MAX_CAPACITY[bloodGroup] ?? 100;
    if (max <= 0) return 0;
    const raw = Math.round((Number(totalFree || 0) / max) * 100);
    return Math.max(0, Math.min(100, raw));
}

function percentToLevel(pct, thresholds) {
    const { highMax, mediumMax } = thresholds;
    if (pct <= highMax) return "high";
    if (pct <= mediumMax) return "medium";
    return "low";
}

export default function InfoPage() {
    const [demand, setDemand] = useState([]);

    const { chipsPerRowDesktop, minChipWidth, gapPx } = content.demand.layout;
    const chipFlexBasis = `calc(${(100 / chipsPerRowDesktop).toFixed(5)}% - ${gapPx}px)`;

    useEffect(() => {
        getBloodStock()
            .then((data) => {
                const mapped = content.demand.groups.map(({ key, label }) => {
                    const s = data.find((x) => x.bloodGroup === key) || {};
                    const percent = toFillPercent(key, s.totalFree);
                    const level = percentToLevel(percent, content.demand.thresholds);
                    const labelPL =
                        level === "high"
                            ? content.demand.labels.high
                            : level === "medium"
                                ? content.demand.labels.medium
                                : content.demand.labels.low;

                    return {
                        groupKey: key,
                        groupLabel: label,
                        level,
                        labelPL,
                        percent,
                        tooltip: `Wolne: ${s.totalFree ?? 0} / Max: ${MAX_CAPACITY[key] ?? 100} (${percent}%)`
                    };
                });

                setDemand(mapped);
            })
            .catch(console.error);
    }, []);

    return (
        <div className="info-page">
            <Header />

            {/* HERO */}
            <section className="bp-hero" aria-label="Rezerwacja wizyty i panel dla placówek">
                <div className="bp-hero__container">
                    <div className="bp-hero__copy">
                        <h1 className="bp-hero__title">
                            {content.hero.title}{" "}
                            <span className="bp-hero__title--accent">{content.hero.accent}</span>
                        </h1>
                        <p className="bp-hero__lead">{content.hero.lead}</p>

                        <div className="bp-hero__cta">
                            {content.hero.ctas.map((c) => (
                                <CTA key={c.to} to={c.to} label={c.label} ariaLabel={c.ariaLabel} />
                            ))}
                        </div>

                        {/* Demand list z JSON + MAX_CAPACITY */}
                        <div className="bp-demand" role="region" aria-label={content.demand.label}>
                            <span className="bp-demand__label">{content.demand.label}</span>
                            <ul
                                className="bp-demand__list"
                                style={{ display: "flex", flexWrap: "wrap", gap: `${gapPx}px` }}
                            >
                                {demand.map((d) => (
                                    <li
                                        key={d.groupKey}
                                        className={`bp-demand__chip bp-demand__chip--${d.level}`}
                                        title={d.tooltip}
                                        style={{
                                            flex: `1 1 ${chipFlexBasis}`,
                                            minWidth: `${minChipWidth}px`,
                                            textAlign: "center"
                                        }}
                                    >
                                        {d.groupLabel} {d.labelPL}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bp-hero__media">
                        <img src={bgImage} alt="Ilustracja krwiodawstwa" loading="eager" />
                    </div>
                </div>
            </section>

            {/* Dla kogo */}
            <section className="bp-section bp-audience">
                <div className="bp-container">
                    <SectionHeading>{content.audience.heading}</SectionHeading>

                    <div className="bp-audience__grid">
                        {content.audience.cards.map((card, idx) => (
                            <article className="bp-card" key={idx}>
                                <div className="bp-card__head">
                                    <h3 className="bp-card__title">{card.title}</h3>
                                    <p className="bp-card__subtitle">{card.subtitle}</p>
                                </div>
                                <ul className="bp-list">
                                    {card.items.map((it, i) => (
                                        <li key={i}>{it}</li>
                                    ))}
                                </ul>
                                <div className="bp-card__cta">
                                    {card.ctas?.map((c) => (
                                        <CTA key={c.to} to={c.to} label={c.label} />
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Jak to działa */}
            <section className="bp-section bp-how">
                <div className="bp-container">
                    <SectionHeading>{content.how.heading}</SectionHeading>

                    <div className="bp-steps">
                        {content.how.steps.map((s, i) => (
                            <div className="bp-step" key={i}>
                                <span className="bp-step__badge">{s.badge}</span>
                                <h4 className="bp-step__title">{s.title}</h4>
                                <p className="bp-step__text">{s.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bp-assurance">
                        {content.how.assurance.map((a, i) => (
                            <div className="bp-assurance__item" key={i}>{a}</div>
                        ))}
                    </div>

                    <div className="bp-cta-center">
                        {content.how.bottomCtas.map((c) => (
                            <CTA key={c.to} to={c.to} label={c.label} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
