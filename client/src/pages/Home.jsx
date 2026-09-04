import { useEffect, useState } from "react";
import { getHealth } from "../services/api.js";

function Home() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.message || "API connected"))
      .catch(() => setStatus("API not reachable. Start the server."));
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Mini Hackathon Team 1</h1>
      <p>{status}</p>
    </main>
  );
}

export default Home;
