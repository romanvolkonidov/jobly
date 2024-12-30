// app/page.tsx
import Navbar from '@/src/components/common/navbar/index';
import HeroSection from '@/src/components/home/hero/index';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
    </main>
  );
}