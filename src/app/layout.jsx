import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Krishi Mitra (कृषि मित्र) | किसान का साथी, हर कदम पर',
  description: 'मध्य प्रदेश नीमच मंडी भाव, सटीक मौसम पूर्वानुमान, फसल सलाह और सरकारी योजनाएं।',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        {/* Responsive Top Navigation Header */}
        <Navbar />

        {/* Main Content Area for Dynamic Routes */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}