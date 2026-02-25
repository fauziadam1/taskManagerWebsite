<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = [
        'title',
        'workspace_id',
    ];

    public function list() {
        return $this->hasMany(Lists::class);
    }
}
