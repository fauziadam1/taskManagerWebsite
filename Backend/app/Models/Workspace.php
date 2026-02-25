<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Workspace extends Model
{
    protected $fillable = [
        'title',
        'user_id',
    ];

    public function board()
    {
        return $this->hasMany(Board::class);
    }
}
