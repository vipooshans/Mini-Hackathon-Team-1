import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollectionScheduleLookup from "./pages/collection-schedule/CollectionScheduleLookup.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CollectionScheduleLookup />} />
        <Route path="/collection-schedule" element={<CollectionScheduleLookup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
