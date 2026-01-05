import React, { useState } from 'react';
import MrzCameraModal from './MrzCameraModal';

export default function TestOcrPage() {
    const [showScanner, setShowScanner] = useState(false);

    const [formData, setFormData] = useState({
        document_number: '',
        surname: '',
        name: '',
        birth_date: '',
        sex: '',
        country: ''
    });

    const formatMrzDate = (mrzDate: string) => {
        if (!mrzDate || mrzDate.length < 6) return "";
        const year = parseInt(mrzDate.substring(0, 2));
        const fullYear = year > 25 ? `19${mrzDate.substring(0, 2)}` : `20${mrzDate.substring(0, 2)}`;
        return `${fullYear}-${mrzDate.substring(2, 4)}-${mrzDate.substring(4, 6)}`;
    };

    const handleOcrResult = (mrzData: any) => {
        setFormData({
            document_number: mrzData.document_number || '',
            surname: mrzData.surname || '',
            name: mrzData.name || '',
            birth_date: formatMrzDate(mrzData.birth_date),
            sex: mrzData.sex || '',
            country: mrzData.country || ''
        });
        setShowScanner(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.page}>
            <style>{keyframes}</style>

            <div style={styles.card}>
                <h1 style={styles.title}>🔍 Scan OCR Intelligent</h1>

                <button
                    onClick={() => setShowScanner(true)}
                    style={styles.scanButton}
                >
                    📷 Scanner le document
                </button>

                {showScanner && <MrzCameraModal onResult={handleOcrResult} />}

                <div style={styles.form}>
                    {renderInput("N° Document", "document_number", formData, handleChange)}
                    {renderInput("Nom", "surname", formData, handleChange)}
                    {renderInput("Prénom", "name", formData, handleChange)}
                    {renderInput("Date de naissance", "birth_date", formData, handleChange)}
                    {renderInput("Sexe", "sex", formData, handleChange)}
                </div>

                {/* Texte défilant */}
                <div style={styles.marquee}>
                    <div style={styles.marqueeText}>
                        ✨ Les informations sont extraites automatiquement — vous pouvez les corriger si nécessaire ✨
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- COMPONENTS ---------- */

function renderInput(
    label: string,
    name: string,
    formData: any,
    handleChange: any
) {
    const filled = formData[name] !== "";

    return (
        <div style={{ ...styles.inputGroup, ...(filled ? styles.filled : {}) }}>
            <label style={styles.label}>{label}</label>
            <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                style={styles.input}
                placeholder={`Entrer ${label.toLowerCase()}`}
            />
        </div>
    );
}

/* ---------- STYLES ---------- */

const styles: any = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f766e, #2563eb)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Inter, sans-serif'
    },

    card: {
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        animation: 'fadeIn 0.8s ease'
    },

    title: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: '20px'
    },

    scanButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        cursor: 'pointer',
        background: 'linear-gradient(90deg, #22c55e, #3b82f6)',
        boxShadow: '0 0 20px rgba(34,197,94,0.6)',
        animation: 'pulse 2s infinite',
        marginBottom: '25px'
    },

    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
    },

    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        transition: 'all 0.3s ease'
    },

    filled: {
        transform: 'scale(1.02)'
    },

    label: {
        fontSize: '13px',
        color: '#e5e7eb'
    },

    input: {
        padding: '12px',
        borderRadius: '10px',
        border: 'none',
        outline: 'none',
        background: 'rgba(255,255,255,0.9)',
        fontSize: '15px'
    },

    marquee: {
        overflow: 'hidden',
        marginTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        paddingTop: '10px'
    },

    marqueeText: {
        whiteSpace: 'nowrap',
        color: '#ecfeff',
        fontSize: '13px',
        animation: 'marquee 12s linear infinite'
    }
};

/* ---------- ANIMATIONS ---------- */

const keyframes = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
    0% { box-shadow: 0 0 15px rgba(34,197,94,0.5); }
    50% { box-shadow: 0 0 30px rgba(59,130,246,0.9); }
    100% { box-shadow: 0 0 15px rgba(34,197,94,0.5); }
}

@keyframes marquee {
    from { transform: translateX(100%); }
    to { transform: translateX(-100%); }
}
`;
