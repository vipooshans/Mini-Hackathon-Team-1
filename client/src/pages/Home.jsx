import Header from "../components/Header.jsx";

const FEATURES = [
  {
    name: "Report & geo-tag",
    desc: "Photograph illegal dumping or overflowing bins. GPS tags the spot and routes it to the right local authority—with live status until resolved.",
  },
  {
    name: "Collection reminders",
    desc: "Municipal schedules and routes, evening-before alerts, and real-time updates when pickups are delayed or rescheduled.",
  },
  {
    name: "Recycling guide",
    desc: "Search where batteries, e-waste, plastic, and glass go. Map certified centres and colour-coded separation by local norms.",
  },
  {
    name: "Recycler marketplace",
    desc: "Link households with scrap collectors and recycling businesses. Request pickup, earn points or a small payment.",
  },
  {
    name: "Education hub",
    desc: "Short articles, videos, and quizzes in Sinhala, Tamil, and English—composting, plastics, and proper segregation.",
  },
  {
    name: "Municipal dashboard",
    desc: "Map reports, assign crews, track resolution times, and get route suggestions that cut fuel and missed pickups.",
  },
];

function Home() {
  return (
    <>
      <Header />

      <section className="hero" aria-label="CleanLanka introduction">
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80"
            alt=""
            width={2000}
            height={1333}
          />
        </div>

        <div className="hero-content">
          <h1 className="hero-brand">CleanLanka</h1>
          <p className="hero-headline">
            Report waste. Track collection. Recycle together.
          </p>
          <p className="hero-support">
            Connect citizens, municipal councils, and recyclers to keep Sri
            Lanka cleaner—from one photo to a resolved pickup.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#join">
              Start a report
            </a>
            <a className="btn btn-ghost" href="#features">
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="section impact" id="impact">
        <div className="section-inner impact-grid">
          <div className="impact-visual">
            <img
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
              alt="Sorted recyclables ready for collection"
              width={1200}
              height={800}
              loading="lazy"
            />
          </div>

          <div>
            <p className="section-label">Why it matters</p>
            <h2 className="section-title">From dumping sites to cleaner streets</h2>
            <p className="section-copy">
              Illegal dumping, overflowing bins, and low recycling rates leave
              communities behind. CleanLanka turns citizen eyes into municipal
              action—and brings informal collectors into a formal network.
            </p>
            <ul className="impact-list">
              <li>
                <span className="impact-num" aria-hidden="true">
                  01
                </span>
                <div>
                  <strong>Photo-backed reports</strong>
                  <span>
                    Evidence and GPS reach the right council faster, so crews
                    respond where it counts.
                  </span>
                </div>
              </li>
              <li>
                <span className="impact-num" aria-hidden="true">
                  02
                </span>
                <div>
                  <strong>Smarter collection</strong>
                  <span>
                    Live delays and citizen feedback help re-route trucks before
                    bins overflow.
                  </span>
                </div>
              </li>
              <li>
                <span className="impact-num" aria-hidden="true">
                  03
                </span>
                <div>
                  <strong>Recycling that pays</strong>
                  <span>
                    Clear disposal guidance plus a marketplace that values paper,
                    metal, and plastic pickups.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section features" id="features">
        <div className="section-inner">
          <p className="section-label">Platform</p>
          <h2 className="section-title">Built for how waste really moves</h2>
          <p className="section-copy">
            Mobile-first tools for reporting, schedules, recycling, education,
            and council operations—designed for Sri Lanka’s languages and
            connectivity.
          </p>

          <div className="feature-rows">
            {FEATURES.map((feature) => (
              <article className="feature-row" key={feature.name}>
                <h3 className="feature-name">{feature.name}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section audience" id="who">
        <div className="section-inner">
          <p className="section-label">Who it serves</p>
          <h2 className="section-title">One network, three roles</h2>
          <p className="section-copy">
            Citizens raise issues and recycle. Councils run operations with
            data. Recyclers grow through a trusted digital marketplace.
          </p>

          <div className="audience-grid">
            <article className="audience-item">
              <h3>Citizens</h3>
              <p>
                Report dumping, get collection reminders, find drop-off points,
                earn rewards for clean-ups and correct segregation.
              </p>
            </article>
            <article className="audience-item">
              <h3>Municipalities</h3>
              <p>
                See complaints on a map, assign crews, measure resolution time,
                and tighten routes to cut fuel and missed streets.
              </p>
            </article>
            <article className="audience-item">
              <h3>Recyclers</h3>
              <p>
                Receive pickup requests from nearby homes, formalise informal
                collection, and grow volume with transparent demand.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section cta-band" id="join">
        <div className="section-inner">
          <p className="section-label">Get involved</p>
          <h2 className="section-title">A cleaner island starts here</h2>
          <p className="section-copy">
            Sinhala, Tamil, and English. Lightweight for slow connections.
            Draft reports offline and send when you are back online—or use SMS
            when data is not an option.
          </p>
          <div className="lang-pills" aria-label="Supported languages">
            <span>සිංහල</span>
            <span>தமிழ்</span>
            <span>English</span>
          </div>
          <div className="cta-actions">
            <a className="btn btn-dark" href="#features">
              Explore the platform
            </a>
            <a className="btn btn-outline-dark" href="mailto:hello@cleanlanka.lk">
              Partner with us
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <span className="footer-brand">CleanLanka</span>
          <span>Citizens · Councils · Recyclers — Mini Hackathon Team 1</span>
        </div>
      </footer>
    </>
  );
}

export default Home;
