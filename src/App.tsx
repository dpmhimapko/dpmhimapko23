import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { FirebaseProvider } from "./FirebaseProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Members from "./pages/Members";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Gallery from "./pages/Gallery";
import Aspirations from "./pages/Aspirations";
import Login from "./pages/Login";
import Admin from "./pages/Admin";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-right" />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/anggota" element={<Members />} />
            <Route path="/berita" element={<News />} />
            <Route path="/berita/:id" element={<NewsDetail />} />
            <Route path="/galeri" element={<Gallery />} />
            <Route path="/aspirasi" element={<Aspirations />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </FirebaseProvider>
  );
}
