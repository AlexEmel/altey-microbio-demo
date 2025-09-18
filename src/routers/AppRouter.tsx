import { MicrobioPage } from '@/pages/MicrobioPage';
import { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const AppRouter = (): ReactNode => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<MicrobioPage />} />
      </Routes>
    </BrowserRouter>
  );
};
