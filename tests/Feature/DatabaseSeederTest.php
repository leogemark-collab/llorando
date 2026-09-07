<?php

use App\Models\User;

test('database seeder creates the development login account', function () {
    $this->seed();

    expect(User::where('email', 'admin@example.com')->first())
        ->not->toBeNull()
        ->and(auth()->validate([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]))->toBeTrue();
});
