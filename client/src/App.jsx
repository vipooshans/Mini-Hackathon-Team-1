import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import CollectionScheduleLookup from "./pages/collection-schedule/CollectionScheduleLookup.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CollectionScheduleLookup />} />
        <Route path="/collection-schedule" element={<CollectionScheduleLookup />} />
      </Routes>
    </BrowserRouter>
=======
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
        </Routes>
      </BrowserRouter>
    </AppProvider>
>>>>>>> origin/main
  );
}

export default App;
