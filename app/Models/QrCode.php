<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCode extends Model
{
    /** @use HasFactory<\Database\Factories\QrCodeFactory> */
    use Auditable, HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'url',
        'size',
        'download_count',
        'print_count',
    ];

    protected function casts(): array
    {
        return [
            'download_count' => 'integer',
            'print_count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function incrementDownloadCount(): void
    {
        $this->increment('download_count');
    }

    public function incrementPrintCount(): void
    {
        $this->increment('print_count');
    }
}
