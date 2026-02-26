<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index($id){
        $card = Card::findOrFail($id);

        $label = Label::where('card_id', $card->id)->get();

        return response()->json($label);
    }

    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|max:255',
            'card_id' => 'required|exists:cards,id',
            'color' => 'nullable|string'
        ]);

        $label = Label::create([
            'title' => $request->title,
            'card_id' => $request->card_id,
            'color' => $request->color
        ]);

        return response()->json([
            'message' => 'Label created',
            'data' => $label
        ], 201);
    }

    public function update(Request $request, $id){
        $label = Label::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'color' => 'sometimes|nullable|string'
        ]);

        $data = $request->only([
            'title',
            'color'
        ]);

        $label->update($data);

        return response()->json([
            'message' => 'Label updated',
            'data' => $label
        ], 201);
    }

    public function destroy($id){
        $label = Label::findOrFail($id);

        $label->delete();

        return response()->json([
            'message' => 'Label deleted'
        ], 200);
    }
}
