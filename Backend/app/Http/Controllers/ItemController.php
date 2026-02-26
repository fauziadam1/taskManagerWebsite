<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index($id)
    {
        $checklist = Checklist::findOrFail($id);

        $item = Item::where('checklist_id', $checklist->id)->orderBy('sort_order')->get();

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

        $order = Item::where('checklist_id', $request->checklist_id)->max('sort_order');

        $item = Item::create([
            'title' => $request->title,
            'sort_order' => ($order ?? 0) + 1,
            'on_check' => $request->on_check ?? false,
            'checklist_id' => $request->checklist_id
        ]);

        return response()->json([
            'message' => 'Item created',
            'data' => $item
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

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
        $itemCheck = Item::findOrFail($id);

        $request->validate([
            'new_position' => 'required|integer|min:1'
        ]);

        $ChecklistId = $itemCheck->checklist_id;
        $newPos = $request->new_position;

        $items = Item::where('checklist_id', $ChecklistId)->where('id', '!=', $itemCheck->id)->orderBy('sort_order')->get();

        $items->splice($newPos - 1, 0, [$itemCheck]);

        foreach ($items as $index => $item) {
            $item->update([
                'sort_order' => $index + 1
            ]);
        }

        return response()->json([
            'message' => 'Item reorder'
        ], 201);
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Item deleted'
        ], 200);
    }
}
