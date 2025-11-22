import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import HomePage from '../pages/public/HomePage';
import AgendaPage from '../pages/public/AgendaPage';
import ServiciosPage from '../pages/public/ServiciosPage';

// Placeholder components for other public pages
const TrabajosRealizadosPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Trabajos Realizados</h1><p>Página en construcción...</p></div>;
const ComoFuncionaPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Cómo Funciona</h1><p>Página en construcción...</p></div>;
const ContactoPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Contacto</h1><p>Página en construcción...</p></div>;

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="trabajos-realizados" element={<TrabajosRealizadosPage />} />
        <Route path="como-funciona" element={<ComoFuncionaPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="contacto" element={<ContactoPage />} />
      </Route>
    </Routes>
  );
}