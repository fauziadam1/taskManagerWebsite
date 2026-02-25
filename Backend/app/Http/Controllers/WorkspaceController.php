<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $workspaces = Workspace::where('user_id', $request->user()->id)->get();

        return response()->json($workspaces);
    }

    public function show(Request $request, $id)
    {
        $workspace = Workspace::findOrFail($id);

        if ($workspace->user_id !== $request->user()->id) {
            abort(403);
        }

        return response()->json($workspace);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $data = Workspace::create([
            'title' => $request->title,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'message' => 'Workspace created',
            'data' => $data
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $workspace = Workspace::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255'
        ]);

        $workspace->update($request->only(['title']));

        return response()->json([
            'message' => 'Workspace updated'
        ], 201);
    }

    public function destroy($id)
    {
        $workspace = Workspace::findOrFail($id);

        $workspace->delete();

        return response()->json([
            'message' => 'Workspace deleted'
        ], 200);
    }
}
