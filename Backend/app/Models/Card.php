<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    protected $fillable = [
        'title',
        'priority',
        'status',
        'sort_order',
        'list_id',
    ];

    public function checklist()
    {
        return $this->hasMany(Checklist::class);
    }

    public function label()
    {
        return $this->hasMany(Label::class);
    }
}
