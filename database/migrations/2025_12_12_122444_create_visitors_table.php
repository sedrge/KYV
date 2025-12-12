<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('profession')->nullable();
            $table->string('home_address')->nullable();
            $table->integer('number_of_children')->nullable()->default(0);
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_country_code')->nullable()->default('+225');
            $table->string('phone_number')->nullable();
            $table->string('phone_country_code')->nullable()->default('+225');
            $table->string('email')->nullable();
            $table->string('travel_type')->nullable();
            $table->string('document_type');
            $table->string('document_number');
            $table->string('nationality')->nullable();
            $table->string('document_scan_path')->nullable();
            $table->string('selfie_path')->nullable();
            $table->string('signature_path')->nullable();
            $table->date('arrival_date')->nullable();
            $table->time('arrival_time')->nullable();
            $table->date('departure_date')->nullable();
            $table->time('departure_time')->nullable();
            $table->string('travel_reason')->nullable();
            $table->string('next_destination')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
