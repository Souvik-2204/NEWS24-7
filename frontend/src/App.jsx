import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';

// Components
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { BreakingTicker } from './components/common/BreakingTicker';
import { Footer } from './components/common/Footer';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { StockMarketPage } from './pages/StockMarketPage';
import { ArticleDetailsPage } from './pages/ArticleDetailsPage';
import { SearchPage } from './pages/SearchPage';
import { SubscriptionPlansPage } from './pages/SubscriptionPlansPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { SavedArticlesPage } from './pages/SavedArticlesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <NewsProvider>
          <div className="min-h-screen bg-[#f8f6f0] text-[#1c1917] flex flex-col selection:bg-[#e8decd] selection:text-[#1c1917]">
            
            {/* Masthead Header matching White & Warm Beige Editorial Theme */}
            <Header />

            {/* Category Pills Navigation */}
            <Navbar />

            {/* Live Breaking News Marquee */}
            <BreakingTicker />

            {/* Main Page Content */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/world" element={<CategoryPage categoryOverride="world" />} />
                <Route path="/india" element={<CategoryPage categoryOverride="india" />} />
                <Route path="/politics" element={<CategoryPage categoryOverride="politics" />} />
                <Route path="/business" element={<CategoryPage categoryOverride="business" />} />
                <Route path="/markets" element={<StockMarketPage />} />
                <Route path="/technology" element={<CategoryPage categoryOverride="technology" />} />
                <Route path="/sports" element={<CategoryPage categoryOverride="sports" />} />
                <Route path="/entertainment" element={<CategoryPage categoryOverride="entertainment" />} />
                <Route path="/science" element={<CategoryPage categoryOverride="science" />} />
                <Route path="/opinion" element={<CategoryPage categoryOverride="opinion" />} />
                
                {/* Dynamic Category Slug Route */}
                <Route path="/category/:categorySlug" element={<CategoryPage />} />
                
                {/* Article Read Page */}
                <Route path="/article/:id" element={<ArticleDetailsPage />} />
                
                {/* Search */}
                <Route path="/search" element={<SearchPage />} />

                {/* Subscriptions */}
                <Route path="/subscriptions" element={<SubscriptionPlansPage />} />

                {/* User Portal */}
                <Route path="/dashboard" element={<UserDashboardPage />} />
                <Route path="/saved" element={<SavedArticlesPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Admin CMS Portal */}
                <Route path="/admin" element={<AdminDashboardPage />} />

                {/* Institutional Pages */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>

            {/* Global Footer */}
            <Footer />

            {/* Floating Instant Demo Role Switcher */}
            <DemoRoleSwitcher />

          </div>
        </NewsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
