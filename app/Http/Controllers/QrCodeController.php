<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQrCodeRequest;
use App\Http\Requests\UpdateQrCodeRequest;
use App\Models\QrCode;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode as EndroidQrCode;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\SvgWriter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QrCodeController extends Controller
{
    public function index(): InertiaResponse
    {
        $this->authorize('viewAny', QrCode::class);

        $qrCodes = QrCode::query()
            ->with('user:id,name,email')
            ->latest()
            ->get();

        return Inertia::render('QrCodes/Index', [
            'qrCodes' => $qrCodes,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', QrCode::class);

        return Inertia::render('QrCodes/Create');
    }

    public function store(StoreQrCodeRequest $request): RedirectResponse
    {
        $this->authorize('create', QrCode::class);

        $qrCode = QrCode::create([
            'user_id' => Auth::id(),
            'title' => $request->validated('title'),
            'url' => $request->validated('url'),
            'size' => $request->validated('size', 300),
        ]);

        return redirect()->route('qr-codes.show', $qrCode)
            ->with('success', 'QR Code créé avec succès.');
    }

    public function show(QrCode $qrCode): InertiaResponse
    {
        $this->authorize('view', $qrCode);

        $qrCode->load('user:id,name,email');

        return Inertia::render('QrCodes/Show', [
            'qrCode' => $qrCode,
        ]);
    }

    public function edit(QrCode $qrCode): InertiaResponse
    {
        $this->authorize('update', $qrCode);

        return Inertia::render('QrCodes/Edit', [
            'qrCode' => $qrCode,
        ]);
    }

    public function update(UpdateQrCodeRequest $request, QrCode $qrCode): RedirectResponse
    {
        $this->authorize('update', $qrCode);

        $qrCode->update([
            'title' => $request->validated('title'),
            'url' => $request->validated('url'),
            'size' => $request->validated('size', 300),
        ]);

        return redirect()->route('qr-codes.show', $qrCode)
            ->with('success', 'QR Code mis à jour avec succès.');
    }

    public function destroy(QrCode $qrCode): RedirectResponse
    {
        $this->authorize('delete', $qrCode);

        $qrCode->delete();

        return redirect()->route('qr-codes.index')
            ->with('success', 'QR Code supprimé avec succès.');
    }

    public function download(QrCode $qrCode): Response
    {
        $this->authorize('view', $qrCode);

        $qrCode->incrementDownloadCount();

        $qrCodeObj = new EndroidQrCode(
            data: $qrCode->url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: (int) $qrCode->size,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $writer = new SvgWriter;
        $result = $writer->write($qrCodeObj);

        return response($result->getString(), 200, [
            'Content-Type' => 'image/svg+xml',
            'Content-Disposition' => 'attachment; filename="qrcode-'.$qrCode->id.'.svg"',
        ]);
    }

    public function generate(QrCode $qrCode): Response
    {
        $this->authorize('view', $qrCode);

        $qrCodeObj = new EndroidQrCode(
            data: $qrCode->url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: (int) $qrCode->size,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $writer = new SvgWriter;
        $result = $writer->write($qrCodeObj);

        return response($result->getString(), 200, [
            'Content-Type' => 'image/svg+xml',
        ]);
    }

    public function print(QrCode $qrCode): InertiaResponse
    {
        $this->authorize('view', $qrCode);

        $qrCode->incrementPrintCount();

        return Inertia::render('QrCodes/Print', [
            'qrCode' => $qrCode,
        ]);
    }
}
