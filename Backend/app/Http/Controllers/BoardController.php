<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return response()->json(Board::all());
    }

    public function show($id)
    {
        $board = Board::findOrFail($id);

        return response()->json($board);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'workspace_id' => 'required|exists:workspaces,id'
        ]);

        $board = Board::create([
            'title' => $request->title,
            'workspace_id' => $request->workspace_id
        ]);

        return response()->json([
            'message' => 'Board created',
            'data' => $board
        ], 201);
    }

    public function star($id)
    {
        $board = Board::findOrFail($id);

        $board->update([
            'star' => !$board->star
        ]);

        return response()->json([
            'message' => 'Board updated',
            'data' => $board
        ]);
    }

    public function starred()
    {
        $board = Board::where('star', true)->get();

        return response()->json($board);
    }

    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string',
        ]);

        $board->update($request->only(['title']));

        return response()->json([
            'message' => 'Board updated',
            'data' => $board
        ], 201);
    }

    public function destroy($id)
    {
        $board = Board::findOrFail($id);

        $board->delete();

        return response()->json([
            'message' => 'Board deleted'
        ], 200);
    }
}
