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
}
