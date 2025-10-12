import "./InfoPage.css";
import Footer from "../Footer/Footer";
import Header from "../../components/Header/Header";
import bgImage from "../../assets/zdj6.png";
import CTA from "../../components/CTA/CTA";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import { useEffect, useState } from "react";
import { getBloodStock } from "../../services/BloodStockService";
import { MAX_CAPACITY } from "../../constants/bloodCapacities";
import content from "../../content/Info/Info.json";

function toFillPercent(bloodGroup, totalFree) {
    const max = MAX_CAPACITY[bloodGroup] || 100;
    if (max <= 0) return 0;
    const raw = Math.round((Number(totalFree || 0) / max) * 100);
    return Math.max(0, Math.min(100, raw));
}

function percentToLevel(pct, thresholds) {
    const highMax = thresholds.highMax;
    const mediumMax = thresholds.mediumMax;
    if (pct <= highMax) return "high";
    if (pct <= mediumMax) return "medium";
    return "low";
}

export default function InfoPage() {
    const [demand, setDemand] = useState([]);

    const chipsPerRowDesktop = content.demand.layout.chipsPerRowDesktop;
    const minChipWidth = content.demand.layout.minChipWidth;
    const gapPx = content.demand.layout.gapPx;
    const chipFlexBasis = "calc(" + (100 / chipsPerRowDesktop).toFixed(5) + "% - " + gapPx + "px)";

    useEffect(() => {
        getBloodStock()
            .then((data) => {
                const mapped = content.demand.groups.map(({ key, label }) => {
                    const s = data.find((x) => x.bloodGroup === key) || {};
                    const percent = toFillPercent(key, s.totalFree);
                    const level = percentToLevel(percent, content.demand.thresholds);
                    const labelPL = level === "high" ? content.demand.labels.high
                        : level === "medium" ? content.demand.labels.medium
                            : content.demand.labels.low;
                    return {
                        groupKey: key,
                        groupLabel: label,
                        level,
                        labelPL,
                        percent,
                        tooltip: "Wolne: " + (s.totalFree || 0) + " / Max: " + (MAX_CAPACITY[key] || 100) + " (" + percent + "%)"
                    };
                });
                setDemand(mapped);
            })
            .catch(() => { });
    }, []);

    return (
        <div className="info-page">
            <Header />

            <section className="bp-hero" aria-label="Rezerwacja wizyty i panel dla placówek">
                <div className="bp-hero-container">
                    <div className="bp-hero-copy">
                        <h1 className="bp-hero-title">
                            {content.hero.title} <span className="bp-hero-title-accent">{content.hero.accent}</span>
                        </h1>
                        <p className="bp-hero-lead">{content.hero.lead}</p>

                        <div className="bp-hero-cta">
                            {content.hero.ctas.map((c) => (
                                <CTA key={c.to} to={c.to} label={c.label} />
                            ))}
                        </div>

                        <div className="bp-demand" role="region" aria-label={content.demand.label}>
                            <span className="bp-demand-label">{content.demand.label}</span>
                            <ul className="bp-demand-list" style={{ gap: gapPx + "px" }}>
                                {demand.map((d) => (
                                    <li
                                        key={d.groupKey}
                                        className={"bp-demand-chip bp-demand-chip-" + d.level}
                                        title={d.tooltip}
                                        style={{ flex: "1 1 " + chipFlexBasis, minWidth: minChipWidth + "px", textAlign: "center" }}
                                    >
                                        {d.groupLabel} {d.labelPL}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bp-hero-media">
                        <img src={bgImage} alt="Ilustracja krwiodawstwa" loading="eager" />
                    </div>
                </div>
            </section>

            <section className="bp-section bp-audience">
                <div className="bp-container">
                    <SectionHeading>{content.audience.heading}</SectionHeading>

                    <div className="bp-audience-grid">
                        {content.audience.cards.map((card, idx) => (
                            <article className="bp-card" key={idx}>
                                <div className="bp-card-head">
                                    <h3 className="bp-card-title">{card.title}</h3>
                                    <p className="bp-card-subtitle">{card.subtitle}</p>
                                </div>
                                <ul className="bp-list">
                                    {card.items.map((it, i) => (
                                        <li key={i}>{it}</li>
                                    ))}
                                </ul>
                                <div className="bp-card-cta">
                                    {card.ctas ? card.ctas.map((c) => <CTA key={c.to} to={c.to} label={c.label} />) : null}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bp-section bp-how">
                <div className="bp-container">
                    <SectionHeading>{content.how.heading}</SectionHeading>

                    <div className="bp-steps">
                        {content.how.steps.map((s, i) => (
                            <div className="bp-step" key={i}>
                                <span className="bp-step-badge">{s.badge}</span>
                                <h4 className="bp-step-title">{s.title}</h4>
                                <p className="bp-step-text">{s.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bp-assurance">
                        {content.how.assurance.map((a, i) => (
                            <div className="bp-assurance-item" key={i}>{a}</div>
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
