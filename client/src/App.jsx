import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RecyclingGuide from "./pages/RecyclingGuide.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recycling-guide" element={<RecyclingGuide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
