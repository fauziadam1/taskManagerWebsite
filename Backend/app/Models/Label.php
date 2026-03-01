<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Label extends Model
{
    protected $fillable = [
        'title',
        'card_id',
        'color'
    ];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }
}
