
import React from 'react';
import BmiCalculator from '@/components/BmiCalculator';

const Index = () => {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-white to-health-light">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-health-primary">Fit Future Calculator</h1>
          <p className="text-lg text-gray-600 mt-2">
            Hitung kebutuhan nutrisi dan rencanakan perjalanan berat badan ideal Anda
          </p>
        </header>
        
        <BmiCalculator />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Fit Future Calculator - Aplikasi kalkulator IMT dan rencana nutrisi personal
          </p>
          <p className="mt-2">
            Konsultasikan selalu dengan ahli kesehatan sebelum memulai program diet atau olahraga baru.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
