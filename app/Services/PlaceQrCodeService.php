<?php

namespace App\Services;

use App\Models\Place;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Support\Facades\Storage;

class PlaceQrCodeService
{
    public function generateQrCodeForPlace(Place $place): string
    {
        $url = route('place.visitor.create', ['place' => $place->id]);

        $qrCode = new QrCode(
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 400,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $writer = new SvgWriter;
        $result = $writer->write($qrCode);

        $filename = 'qrcodes/places/'.$place->id.'.svg';
        Storage::disk('public')->put($filename, $result->getString());

        return $filename;
    }

    public function deleteQrCodeForPlace(Place $place): void
    {
        if ($place->qr_code_path && Storage::disk('public')->exists($place->qr_code_path)) {
            Storage::disk('public')->delete($place->qr_code_path);
        }
    }
}
