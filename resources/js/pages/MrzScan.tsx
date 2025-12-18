import React from 'react';
import MrzUploader from '../components/MrzUploader';

export default function MrzScan() {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Scan MRZ – Carte d’identité
      </h1>
      <MrzUploader />
    </div>
  );
}
