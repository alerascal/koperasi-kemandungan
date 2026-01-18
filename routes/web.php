<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::get('/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
})->name('dashboard');
Route::get('/', function () {
    return Inertia::render('Home');
});
Route::get('/products', function () {
    return Inertia::render('Products/Index');
});

Route::get('/products/{slug}', function ($slug) {
    return Inertia::render('Products/Show', [
        'slug' => $slug,
    ]);
});
