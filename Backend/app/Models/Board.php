<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = [
        'title',
        'star',
        'workspace_id',
    ];

    public function list()
    {
        return $this->hasMany(Lists::class);
    }

    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }
}
