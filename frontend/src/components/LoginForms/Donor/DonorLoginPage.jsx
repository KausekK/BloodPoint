// import Header from "../../components/Header/Header";
// import Footer from "../Footer/Footer";
// import UniversalLoginCard from "../Auth/UniversalLoginCard";
// import content from "../../content/Login/DonorLoginPage.json";
// import "./LoginCommon.css"; // opcjonalnie, jeżeli chcesz trzymać wspólny CSS

// export default function LoginDonorPage() {
//   return (
//     <>
//       <Header />
//       <main className="bp-section login">
//         <div className="bp-container">
//           <header className="login-head">
//             <h1 className="login-title">{content.title}</h1>
//             <p className="login-lead">{content.lead}</p>
//           </header>

//           <section className="login-grid" aria-label="Logowanie dawcy">
//             <UniversalLoginCard
//               loginType={content.loginType}
//               idName={content.id.name}
//               idType={content.id.type}
//               idPlaceholder={content.id.placeholder}
//               passwordPlaceholder={content.password.placeholder}
//               submitText={content.submit.label}
//             />
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }
