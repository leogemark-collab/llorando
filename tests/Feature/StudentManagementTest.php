<?php

use App\Models\Student;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('students can be listed', function () {
    Student::factory()->count(2)->create();

    $this->get(route('students.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Students')
            ->has('students.data', 2));
});

test('a student can be created', function () {
    $student = Student::factory()->make();

    $this->post(route('students.store'), $student->only([
        'first_name', 'last_name', 'email', 'program', 'gender', 'birthday', 'year_level',
    ]))
        ->assertRedirect(route('students.index'))
        ->assertSessionHas('toast.message', 'Student created successfully.');

    $this->assertDatabaseHas('students', ['email' => $student->email]);
});

test('a student can be updated and their email remains unique', function () {
    $student = Student::factory()->create();

    $this->put(route('students.update', $student), [
        ...$student->only(['first_name', 'last_name', 'email', 'program', 'gender', 'birthday']),
        'year_level' => 4,
    ])->assertRedirect(route('students.index'));

    expect($student->refresh()->year_level)->toBe('4');
});

test('a student can be removed', function () {
    $student = Student::factory()->create();

    $this->delete(route('students.destroy', $student))
        ->assertRedirect(route('students.index'));

    $this->assertModelMissing($student);
});

test('a student must have valid and unique details', function () {
    $student = Student::factory()->create();

    $this->post(route('students.store'), [
        'first_name' => '',
        'last_name' => '',
        'email' => $student->email,
        'birthday' => now()->addDay()->toDateString(),
        'program' => '',
        'gender' => 'other',
        'year_level' => 5,
    ])->assertInvalid([
        'first_name',
        'last_name',
        'email',
        'birthday',
        'program',
        'gender',
        'year_level',
    ]);
});
