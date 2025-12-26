import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface QrCode {
    id: string;
    title: string;
    url: string;
    size: string;
}

interface Props {
    qrCode: QrCode;
}

export default function Print({ qrCode }: Props) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <Head title={`Imprimer - ${qrCode.title}`} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
                <div className="text-center">
                    <h1 className="mb-2 text-3xl font-bold text-black">{qrCode.title}</h1>
                    <p className="mb-8 text-sm text-gray-600">{qrCode.url}</p>

                    <div className="mb-8 inline-block rounded-lg border-2 border-gray-300 p-6">
                        <img
                            src={`/qr-codes/${qrCode.id}/generate`}
                            alt={qrCode.title}
                            className="h-auto w-full"
                            style={{ maxWidth: `${qrCode.size}px` }}
                        />
                    </div>

                    <p className="text-xs text-gray-500">
                        Scannez ce QR Code pour accéder au contenu
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        margin: 2cm;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}
