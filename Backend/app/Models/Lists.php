<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lists extends Model
{
    protected $fillable = [
        'title',
        'board_id',
        'sort_order'
    ];

    public function card()
    {
        return $this->hasMany(Card::class);
    }
}
