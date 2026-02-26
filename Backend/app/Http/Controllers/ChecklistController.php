<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Checklist;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    public function index($id)
    {
        $card = Card::findOrFail($id);

        $checklist = Checklist::where('card_id', $card->id)->get();

        return response()->json($checklist);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'card_id' => 'required|exists:cards,id'
        ]);

        $order = Checklist::where('card_id', $request->card_id)->max('sort_order');

        $checklist = Checklist::create([
            'title' => $request->title,
            'sort_order' => ($order ?? 0) + 1,
            'card_id' => $request->card_id
        ]);

        return response()->json([
            'message' => 'Checklist created',
            'data' => $checklist
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $checklist = Checklist::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string'
        ]);

        $checklist->update($request->only('title'));

        return response()->json([
            'message' => 'Checklist updated',
            'data' => $checklist
        ], 201);
    }

    public function destroy($id){
        $checklist = Checklist::findOrFail($id);

        $checklist->delete();

        return response()->json([
            'message' => 'Checklist deleted'
        ], 200);
    }
}
