<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemChecklist extends Model
{
    protected $fillable = [
        'title',
        'on_check',
        'sort_order',
        'checklist_id'
    ];

    public function checklist()
    {
        return $this->belongsTo(Checklist::class);
    }
}