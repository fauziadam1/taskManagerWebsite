<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Models\ItemChecklist;
use Illuminate\Http\Request;

class ItemChecklistController extends Controller
{
    public function index($id)
    {
        $checklist = Checklist::findOrFail($id);

        $item = ItemChecklist::where('checklist_id', $checklist->id)->orderBy('sort_order')->get();

        return response()->json($item);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'sort_order' => 'nullable|integer',
            'on_check' => 'sometimes|boolean',
            'checklist_id' => 'required|exists:checklists,id'
        ]);

        $order = ItemChecklist::where('checklist_id', $request->checklist_id)->max('sort_order');

        $item = ItemChecklist::create([
            'title' => $request->title,
            'sort_order' => ($order ?? 0) + 1,
            'on_check' => $request->on_check,
            'checklist_id' => $request->checklist_id
        ]);

        return response()->json([
            'message' => 'Item created',
            'data' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = ItemChecklist::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string',
        ]);

        $item->update($request->only('title'));

        return response()->json([
            'message' => 'Item updated',
            'data' => $item
        ], 201);
    }

    public function reorder(Request $request, $id)
    {
        $item = ItemChecklist::findOrFail($id);

        $request->validate([
            'new_position' => 'required|integer|min:1'
        ]);

        $ChecklistId = $request->checklist_id;
        $newPos = $request->new_position;

        $items = ItemChecklist::where('checklist_id', $ChecklistId)->where('id', '!=', $item->id)->orderBy('sort_order')->get();

        $items->splice($newPos - 1, 0, [$item]);

        foreach ($items as $index) {
            $items->update([
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'message' => 'Item reorder'
        ], 201);
    }

    public function destroy($id)
    {
        $item = ItemChecklist::findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Item deleted'
        ], 200);
    }
}
