import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import TrustBanner from '@/components/home/TrustBanner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import TrendingNow from '@/components/home/TrendingNow';
import BestSellers from '@/components/home/BestSellers';
import FeaturedBrands from '@/components/home/FeaturedBrands';
import CustomerReviews from '@/components/home/CustomerReviews';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBanner />
        <FeaturedCategories />
        <TrendingNow />
        <BestSellers />
        <FeaturedBrands />
        <CustomerReviews />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
