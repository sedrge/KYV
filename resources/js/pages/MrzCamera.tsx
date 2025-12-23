import React, { useState } from 'react';
import MrzCameraModal from './MrzCameraModal'; // Assurez-vous que le chemin est correct

export default function TestOcrPage() {
    const [showScanner, setShowScanner] = useState(false);
    
    // État local simple pour tester le pré-remplissage
    const [formData, setFormData] = useState({
        document_number: '',
        surname: '',
        name: '',
        birth_date: '',
        sex: '',
        country: ''
    });

    // Fonction de formatage YYMMDD -> YYYY-MM-DD
    const formatMrzDate = (mrzDate: string) => {
        if (!mrzDate || mrzDate.length < 6) return "";
        const year = parseInt(mrzDate.substring(0, 2));
        const fullYear = year > 25 ? `19${mrzDate.substring(0, 2)}` : `20${mrzDate.substring(0, 2)}`;
        return `${fullYear}-${mrzDate.substring(2, 4)}-${mrzDate.substring(4, 6)}`;
    };

    // Callback appelé par le scanner enfant
    const handleOcrResult = (mrzData: any) => {
        console.log("Données brutes reçues du scanner :", mrzData);

        // On remplit l'état local avec les données du JSON Python
        setFormData({
            document_number: mrzData.document_number || '',
            surname: mrzData.surname || '',
            name: mrzData.name || '',
            birth_date: formatMrzDate(mrzData.birth_date),
            sex: mrzData.sex || '',
            country: mrzData.country || ''
        });

        setShowScanner(false); // On ferme le modal
        alert("Données extraites avec succès !");
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ color: '#333' }}>Test Pré-remplissage OCR</h1>
            
            <button 
                onClick={() => setShowScanner(true)}
                style={{
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: '30px'
                }}
            >
                📷 Lancer le Scanner
            </button>

            {showScanner && (
                <MrzCameraModal onResult={handleOcrResult} />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>N° Document :</label>
                    <input 
                        type="text" 
                        value={formData.document_number} 
                        readOnly 
                        style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Nom :</label>
                    <input 
                        type="text" 
                        value={formData.surname} 
                        readOnly 
                        style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Prénom :</label>
                    <input 
                        type="text" 
                        value={formData.name} 
                        readOnly 
                        style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Date de naissance :</label>
                    <input 
                        type="text" 
                        value={formData.birth_date} 
                        readOnly 
                        style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Sexe :</label>
                    <input 
                        type="text" 
                        value={formData.sex} 
                        readOnly 
                        style={{ width: '100%', padding: '8px', backgroundColor: '#f3f4f6' }} 
                    />
                </div>
            </div>

            <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                Note : Les champs sont en lecture seule pour ce test.
            </p>
        </div>
    );
}
