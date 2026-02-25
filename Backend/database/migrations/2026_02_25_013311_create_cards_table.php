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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(1);
            $table->foreignId('list_id')->constrained()->cascadeOnDelete();
            $table->enum('priority', ['Not Sure', 'Lowest', 'Low', 'Medium', 'High', 'Highest']);
            $table->enum('status', ['Not Sure', 'Approved', 'In Review', 'Done', 'In Progress', 'To Do']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
