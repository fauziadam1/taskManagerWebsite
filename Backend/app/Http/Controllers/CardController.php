<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Lists;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function show($id)
    {
        $card = Card::findOrFail($id);

        return response()->json($card);
    }

    public function index($id)
    {
        $list = Lists::findOrFail($id);

        $card = Card::where('list_id', $list->id)->orderBy('sort_order')->get();

        return response()->json($card);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'priority' => 'nullable|in:Not Sure,Lowest,Low,Medium,High,Highest',
            'status' => 'nullable|in:Not Sure,Approved,In Review,Done,In Progress,To Do',
            'sort_order' => 'nullable|integer',
            'list_id' => 'required|exists:lists,id'
        ]);

        $order = Card::where('list_id', $request->list_id)->max('sort_order');

        $card = Card::create([
            'title' => $request->title,
            'sort_order' => ($order ?? 0) + 1,
            'list_id' => $request->list_id
        ]);

        return response()->json([
            'message' => 'Card created',
            'data' => $card
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string',
            'priority' => 'sometimes|nullable|in:Not Sure,Lowest,Low,Medium,High,Highest',
            'status' => 'sometimes|nullable|in:Not Sure,Approved,In Review,Done,In Progress,To Do'
        ]);

        $card->update($request->only('title', 'priority', 'status'));

        return response()->json([
            'message' => 'Card updated',
            'data' => $card
        ], 201);
    }

    public function reorder(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $request->validate([
            'new_position' => 'required|integer|min:1'
        ]);

        $listId = $card->list_id;
        $newPos = $request->new_position;

        $cards = Card::where('list_id', $listId)->where('id', '!=', $card->id)->orderBy('sort_order')->get();

        $cards->splice($newPos - 1, 0, [$card]);

        foreach ($cards as $index => $item) {
            $item->update([
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'message' => 'Card reordered'
        ], 201);
    }

    public function relist(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        $request->validate([
            'list_id' => 'required|exists:lists,id',
            'new_position' => 'required|integer|min:1'
        ]);

        $cards = Card::where('list_id', $request->list_id)
            ->where('id', '!=', $card->id)
            ->orderBy('sort_order')
            ->get();

        $card->list_id = $request->list_id;

        $cards->splice($request->new_position - 1, 0, [$card]);

        foreach ($cards as $index => $item) {
            $item->update([
                'list_id' => $request->list_id,
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'message' => 'Card moved'
        ]);
    }

    public function destroy($id)
    {
        $card = Card::findOrFail($id);

        $card->delete();

        return response()->json([
            'message' => 'Card deleted'
        ]);
    }
}
