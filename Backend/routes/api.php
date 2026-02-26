<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);

    Route::get('/workspaces/{workspace}/{user}', [WorkspaceController::class, 'show']);
    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspace', [WorkspaceController::class, 'store']);
    Route::delete('/workspace/{workspace}', [WorkspaceController::class, 'destroy']);

    Route::get('/workspace/{workspace}/boards', [BoardController::class, 'index']);
    Route::get('/board/{board}', [BoardController::class, 'show']);
    Route::post('/board', [BoardController::class, 'store']);
    Route::put('/board/{board}', [BoardController::class, 'update']);

    Route::get('/board/{board}/lists', [ListController::class, 'index']);
    Route::post('/list', [ListController::class, 'store']);
    Route::put('/list/{list}', [ListController::class, 'update']);
    Route::put('/reorder/list/{list}', [ListController::class, 'reorder']);

    Route::get('/card/{card}', [CardController::class, 'show']);
    Route::get('/list/{list}/cards', [CardController::class, 'index']);
    Route::post('/card', [CardController::class, 'store']);
    Route::put('/card/{card}', [CardController::class, 'update']);
    Route::put('/reorder/card/{card}', [CardController::class, 'reorder']);
    Route::put('/relist/card/{card}', [CardController::class, 'relist']);
    Route::delete('/card/{card}', [CardController::class, 'destroy']);

    Route::get('/card/{card}/checklists', [ChecklistController::class, 'index']);
    Route::post('/checklist', [ChecklistController::class, 'store']);
    Route::put('/checklist/{checklist}', [ChecklistController::class, 'update']);
    Route::put('/reorder/checklist/{checklist}', [ChecklistController::class, 'reorder']);
    Route::delete('/checklist/{checklist}', [ChecklistController::class, 'destroy']);

    Route::get('/checklist/{checklist}/items', [ItemController::class, 'index']);
    Route::post('/item', [ItemController::class, 'store']);
    Route::put('/item/{item}', [ItemController::class, 'update']);
    Route::delete('/item/{item}', [ItemController::class, 'destroy']);
    Route::put('/reorder/item/{item}', [ItemController::class, 'reorder']);
});

Route::get('/users', [UserController::class, 'index']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
