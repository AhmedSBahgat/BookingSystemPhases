import Header from '../components/Header.jsx';
import Hero from '../components/Hero.jsx';
import MainContent from '../components/MainContent.jsx';
import Footer from '../components/Footer.jsx';

function HomePage() {
  return (
    <div className="app-root">
      <Header />
      <Hero />
      <MainContent />
      <Footer />
    </div>
  );
}

export default HomePage;
