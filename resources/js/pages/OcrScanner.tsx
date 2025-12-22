import React, { useState } from 'react';
import axios from 'axios';

const OcrScanner = () => {
    // État du formulaire
    const [formData, setFormData] = useState({
        surname: '',
        name: '',
        document_number: '',
        birth_date: '',
    });
    const [loading, setLoading] = useState(false);

    // On définit le type de l'événement 'e' comme un changement d'input HTML
const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Le '?' vérifie si e.target.files n'est pas nul
    const file = e.target.files?.[0]; 
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setLoading(true);
    try {
        // Remplacez par votre URL d'API Laravel
        const response = await axios.post('/api/ocr/process', data);
        
        if (response.data.status === 'success') {
            const info = response.data.data;
            setFormData({
                surname: info.surname,
                name: info.name,
                document_number: info.document_number,
                birth_date: formatMrzDate(info.birth_date),
            });
        }
    } catch (error) {
        console.error("Erreur OCR:", error);
    } finally {
        setLoading(false);
    }
};

// On précise que 'mrzDate' est une chaîne de caractères (string)
const formatMrzDate = (mrzDate: string): string => {
    if (!mrzDate || mrzDate.length < 6) return "";
    
    const yearStr = mrzDate.substring(0, 2);
    const year = parseInt(yearStr);
    
    // Logique pour déterminer le siècle (si > 25, on suppose 1900, sinon 2000)
    const fullYear = year > 25 ? `19${yearStr}` : `20${yearStr}`; 
    const month = mrzDate.substring(2, 4);
    const day = mrzDate.substring(4, 6);
    
    return `${fullYear}-${month}-${day}`;
};


    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {loading && <p>Analyse du document en cours...</p>}

            <form>
                <input value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} placeholder="Nom" />
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Prénom" />
                <input value={formData.document_number} onChange={(e) => setFormData({...formData, document_number: e.target.value})} placeholder="N° Document" />
                <button type="submit">Valider et Enregistrer</button>
            </form>
        </div>
    );
};
