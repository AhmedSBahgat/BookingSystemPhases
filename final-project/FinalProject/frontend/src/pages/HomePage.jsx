import Header from "../components/Header";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <div className="app-root">
      <Header />

      <main>
        <section className="hero-section">
          <div className="section-content">
            <h1>Welcome to my React version</h1>
            <p>
              This is the integrated full stack version of my earlier Task I page.
            </p>
          </div>
        </section>

        <section className="section">
          <div className="content-card">
            <h2>Features</h2>
            <ul>
              <li>React frontend with routing</li>
              <li>Express backend API</li>
              <li>PostgreSQL database storage</li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
