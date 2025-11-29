import "./Home.css";
import Footer from "../Footer/Footer";
import BloodStock from "../BloodStock/BloodStock";
import Header from "../../components/Header/Header";
import CTA from "../../components/CTA/CTA";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import homeContent from "../../content/Home/Home.json";

export default function Home() {
  const hero = homeContent.hero || {};
  const bloodStock = homeContent.bloodStock || {};

  return (
    <div className="home">
      <Header />

      <div className="main-content">
        <SectionHeading>{hero.title}</SectionHeading>

        <div className="hero-section">
          <p>{hero.subtitle}</p>
          <p>{hero.note}</p>
          <div className="hero-cta-wrapper">
            <CTA label={hero.cta && hero.cta.label} to={hero.cta && hero.cta.to} />
          </div>
        </div>
      </div>

      <SectionHeading>{bloodStock.title}</SectionHeading>
      <BloodStock />

      <Footer />
    </div>
  );
}
