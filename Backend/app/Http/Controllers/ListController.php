<?php

namespace App\Http\Controllers;

use App\Models\Lists;
use App\Models\Board;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function index($id) {
        $board = Board::findOrFail($id);

        $list = Lists::where('board_id', $board->id)->orderBy('sort_order')->get();

        return response()->json($list);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'board_id' => 'required|exists:boards,id',
            'sort_order' => 'nullable|integer'
        ]);

        $order = Lists::where('board_id', $request->board_id)->max('sort_order');

        $list = Lists::create([
            'title' => $request->title,
            'board_id' => $request->board_id,
            'sort_order' => ($order ?? 0) + 1
        ]);

        return response()->json([
            'message' => 'List created',
            'data' => $list
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $list = Lists::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string'
        ]);

        $list->update($request->only('title'));

        return response()->json([
            'message' => 'List updated',
            'data' => $list
        ], 201);
    }

    public function reorder(Request $request, $id)
    {
        $list = Lists::findOrFail($id);

        $request->validate([
            'new_position' => 'required|integer|min:1'
        ]);

        $boardId = $list->board_id;
        $newPos = $request->new_position;

        $lists = Lists::where('board_id', $boardId)
            ->where('id', '!=', $list->id)
            ->orderBy('sort_order')
            ->get();    

        $lists->splice($newPos - 1, 0, [$list]);

        foreach ($lists as $index => $item) {
            $item->update([
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'message' => 'List reordered'
        ], 201);
    }

    public function destroy($id){
        $list = Lists::findOrFail($id);

        $list->delete();

        return response()->json([
            'message' => 'List deleted'
        ], 200);
    }
}
