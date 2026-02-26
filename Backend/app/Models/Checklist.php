<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    protected $fillable = [
        'title',
        'sort_order',
        'card_id'
    ];

    public function card()
    {
        return $this->belongsTo(Card::class);
    }

    public function item()
    {
        return $this->hasMany(Item::class);
    }
}
