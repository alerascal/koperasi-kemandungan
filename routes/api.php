<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\{
  CategoryController,
  ProductController,
  OrderController,
  SavingController,
  DepositController,
  NewsController,
  AuthController
};



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
});

/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{slug}', [NewsController::class, 'show']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED API (SANCTUM)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

  // CATEGORY (ADMIN)
  Route::post('/categories', [CategoryController::class, 'store']);
  Route::put('/categories/{id}', [CategoryController::class, 'update']);
  Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

  // PRODUCT (ADMIN)
  Route::post('/products', [ProductController::class, 'store']);
  Route::put('/products/{id}', [ProductController::class, 'update']);
  Route::delete('/products/{id}', [ProductController::class, 'destroy']);

  // ORDER
  Route::get('/orders', [OrderController::class, 'index']);
  Route::get('/orders/{id}', [OrderController::class, 'show']);
  Route::post('/orders', [OrderController::class, 'store']);
  Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
  Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

  // SAVING
  Route::get('/saving', [SavingController::class, 'show']);
  Route::get('/saving/transactions', [SavingController::class, 'transactions']);
  Route::post('/saving/deposit', [SavingController::class, 'deposit']);
  Route::post('/saving/withdraw', [SavingController::class, 'withdraw']);

  // DEPOSIT
  Route::get('/deposits', [DepositController::class, 'index']);
  Route::get('/deposits/{id}', [DepositController::class, 'show']);
  Route::post('/deposits', [DepositController::class, 'store']);
  Route::post('/deposits/{id}/cancel', [DepositController::class, 'cancel']);

  // NEWS (ADMIN)
  Route::post('/news', [NewsController::class, 'store']);
  Route::put('/news/{id}', [NewsController::class, 'update']);
  Route::delete('/news/{id}', [NewsController::class, 'destroy']);
});
