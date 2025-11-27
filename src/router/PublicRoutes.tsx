import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import HomePage from '../pages/public/HomePage';
import AgendaPage from '../pages/public/AgendaPage';
import ServiciosPage from '../pages/public/ServiciosPage';
import TrabajosRealizadosPage from '../pages/public/TrabajosRealizadosPage';
import TrabajoPublicPage from '../pages/public/TrabajoPublicPage';
import ComoFuncionaPage from '../pages/public/ComoFuncionaPage';
import ContactoPage from '../pages/public/ContactoPage';

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="servicios" element={<ServiciosPage />} />
        <Route path="trabajos-realizados" element={<TrabajosRealizadosPage />} />
        <Route path="trabajos/:id/public" element={<TrabajoPublicPage />} />
        <Route path="como-funciona" element={<ComoFuncionaPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="contacto" element={<ContactoPage />} />
      </Route>
    </Routes>
  );
}