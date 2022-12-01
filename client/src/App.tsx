import { Routes, Route } from "react-router-dom";
import { Container } from "reactstrap";

import About from "./pages/About";
import Data from "./pages/Data";
import Analyze from "./pages/Analyze";
import StateProvider from "./state/Provider";
import Processing from "./components/Processing";
import Navigation from "./components/Navigation";
import WindowSizeWarning from "./components/WindowSizeWarning";

import "./App.css";

const App = () => (
  <StateProvider>
    <WindowSizeWarning />
    <Navigation />
    <Container className="pb-5">
      <Processing />
      <div className="mt-4">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data />} />
          <Route path="/" element={<Analyze />} />
          <Route path="*" element={<Analyze />} />
        </Routes>
      </div>
    </Container>
  </StateProvider>
);

export default App;
