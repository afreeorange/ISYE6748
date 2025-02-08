import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";

import { Footer, Navigation } from "./shared/components";
import About from "./pages/About";
import Data from "./pages/Data";
import NotFound from "./pages/404";
import Whoops from "./pages/Whoops";
import Analyze from "./pages/Analyze";
import Home from "./pages/Home";
import { queryClient } from "./shared/queries";

import "./App.scss";

const App = () => (
  <>
    <Navigation />
    <ErrorBoundary FallbackComponent={Whoops}>
      <QueryClientProvider client={queryClient}>
        <main className="max-w-6xl px-7 my-8 mx-auto">
          <Routes>
            <Route path="/analyze/*" element={<Analyze />} />
            <Route path="/about" element={<About />} />
            <Route path="/data" element={<Data />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </QueryClientProvider>
    </ErrorBoundary>
    <Footer />
  </>
);

export default App;
