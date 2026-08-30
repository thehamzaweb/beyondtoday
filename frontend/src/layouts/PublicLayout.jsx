import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

export default function PublicLayout() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
