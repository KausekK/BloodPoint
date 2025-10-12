// src/pages/LoginInfoPage.jsx
import Header from "../../components/Header/Header";
import Footer from "../Footer/Footer";
import CTA from "../../components/CTA/CTA";
import content from "../../content/LoginInfo/LoginInfoPage.json";
import "./LoginInfoPage.css";

export default function LoginInfoPage() {
  return (
    <>
      <Header />
      <main className="bp-section login">
        <div className="bp-container">
          <header className="login-head">
            <h1 className="login-title">{content.title}</h1>
          </header>

          <section className="login-grid" aria-label="Wybór logowania">
            {content.cards.map((card) => (
              <article key={card.key ?? card.title} className="bp-card login-card">
                <h2 className="login-card-title">{card.title}</h2>
                <p className="login-card-desc">{card.desc}</p>
                <CTA to={card.cta.to} label={card.cta.label} />
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

