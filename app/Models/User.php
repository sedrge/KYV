<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Place;
use App\Models\Installation\Config;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function config()
    {
        return $this->hasOneThrough(Config::class, Place::class, 'id', 'place_id', 'place_id', 'id');
    }

    public function hasConfig(): bool
    {
        return $this->config()->exists();
    }


    public function isSuperAdmin(): bool
    {
        return true;
    }

    public function isAdmin(): bool
    {
        return true;
    }

    public function isInvestigator(): bool
    {
        return true;
    }

    public function isHost(): bool
    {
        return true;
    }

    public function isAgent(): bool
    {
        return true;
    }

    public function isVisitor(): bool
    {
        return true;
    }

}
