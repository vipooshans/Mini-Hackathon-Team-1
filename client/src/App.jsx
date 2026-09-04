import { BrowserRouter, Routes, Route } from "react-router-dom";
import CollectionScheduleLookup from "./pages/collection-schedule/CollectionScheduleLookup.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collection-schedule" element={<CollectionScheduleLookup />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}


export default App;
