import "./Home.css";
import Footer from "../Footer/Footer";
import BloodStock from "../BloodStock/BloodStock";
import Header from "../../components/Header/Header";

import CTA from "../../components/CTA/CTA";
import SectionHeading from "../../components/SectionHeading/SectionHeading";
import homeContent from "../../data/Home/Home.json";

export default function Home() {
    const { hero, bloodStock } = homeContent;

    const handlePause = (e) => e.target.play();
    const handleContextMenu = (e) => e.preventDefault();

    return (
        <div className="home">
            <Header />

            <div className="main-content">
                <div className="video-wrapper">
                    <video
                        src={hero.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        onPause={handlePause}
                        onContextMenu={handleContextMenu}
                        style={{ width: "100%", height: "auto", display: "block" }}
                    />
                </div>

                <SectionHeading>{hero.title}</SectionHeading>
                <div className="hero-section">
                    <p>{hero.subtitle}</p>
                    <p>{hero.note}</p>
                    <div className="hero-cta-wrapper">
                        <CTA label={hero.cta.label} to={hero.cta.to} />
                    </div>
                </div>


            </div>

            <SectionHeading>{bloodStock.title}</SectionHeading>
            <BloodStock />

            <Footer />
        </div>
    );
}
