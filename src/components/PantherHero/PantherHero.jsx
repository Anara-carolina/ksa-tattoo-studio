import "./PantherHero.css";
import pantera from "../../assets/images/pantera.png";

function PantherHero({ children }) {
  return (
    <section className="panther-hero">

      <img
        src={pantera}
        alt="Pantera KSA Studio"
        className="panther-hero-background"
      />

      <div className="panther-hero-overlay"></div>

      <div className="panther-hero-content">
        {children}
      </div>

    </section>
  );
}

export default PantherHero;