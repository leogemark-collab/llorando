<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route ::apiResource('students', StudentController::class);

Route::middleware(['auth'])->group(function () {
    Route::get ('dashboard', function (){
        return Inertia::render('dashboard');
   })->name('dashboard');
   
});

require __DIR__.'/settings.php';
