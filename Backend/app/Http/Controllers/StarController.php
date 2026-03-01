<?php

namespace App\Http\Controllers;

use App\Models\Starred;
use Illuminate\Http\Request;

use function Pest\Laravel\get;

class StarController extends Controller
{
    public function index(Request $request)
    {
        $star = Starred::where('user_id', $request->user()->id->get());

        return response()->json($star);
    }

    public function store(Request $request)
    {
        $request->validate([
            'board_id' => 'required|exists:boards,id'
        ]);

        $star = Starred::create([
            'board_id' => $request->board_id,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Board starred',
            'data' => $star
        ]);
    }

    public function destroy($id)
    {
        $star = Starred::findOrFail($id);

        $star->delete();

        return response()->json([
            'message' => 'Board unstar'
        ]);
    }
}
