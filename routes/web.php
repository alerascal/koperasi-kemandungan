<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;


Route::get('/login', function () {
    return Inertia::render('Auth/login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Auth/register');
})->name('register');


Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});
