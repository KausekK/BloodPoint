import "./Home.css";
import Footer from "../Footer/Footer";

export default function Home() {
  const handlePause = (e) => e.target.play();
  const handleContextMenu = (e) => e.preventDefault();

  return (
    <div className="home">
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="link-group">
            <a routerLink="/" routerLinkActive="active-link">
              Krwiodawca
            </a>
            <a routerLink="/" routerLinkActive="active-link">
              Dla dawcy
            </a>
            <a routerLink="/" routerLinkActive="active-link">
              Informacje
            </a>
            <a routerLink="/" routerLinkActive="active-link">
              Punkty krwiodawstwa
            </a>
          </div>
          <button className="login-button">Zaloguj się</button>
        </div>
      </div>
      <div className="main-content">
        <div className="video-wrapper">
          <video
            src="src/assets/video/rckik_warszawa_animacja1.mp4"
            autoPlay
            loop
            muted
            playInline
            disablePictureInPicture
            disableRemotePlayback
            onPause={handlePause}
            onContextMenu={handleContextMenu}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        <h2>Umów wizytę</h2>
        <p>Wybierz miasto i datę, aby zobaczyć dostępne terminy wizyt.</p>
        <p>
          Skorzystaj z menu nawigacyjnego, aby uzyskać dostęp do różnych funkcji
          aplikacji.
        </p>
      </div>
      <Footer />
    </div>
  );
}
