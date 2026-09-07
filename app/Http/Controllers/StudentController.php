<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Students', [
            'students' => Student::query()
                ->orderBy('last_name')
                ->orderBy('first_name')
                ->paginate(12),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Student::create($this->validatedStudent($request));

        return to_route('students.index')->with('toast', [
            'type' => 'success',
            'message' => 'Student created successfully.',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student): RedirectResponse
    {
        $student->update($this->validatedStudent($request, $student));

        return to_route('students.index')->with('toast', [
            'type' => 'success',
            'message' => 'Student updated successfully.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return to_route('students.index')->with('toast', [
            'type' => 'success',
            'message' => 'Student removed successfully.',
        ]);
    }

    /**
     * @return array{first_name: string, last_name: string, birthday: string, email: string, program: string, gender: string, year_level: int}
     */
    private function validatedStudent(Request $request, ?Student $student = null): array
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'birthday' => ['required', 'date', 'before:today'],
            'email' => ['required', 'email', 'max:255', Rule::unique('students', 'email')->ignore($student)],
            'program' => ['required', 'string', 'max:60'],
            'gender' => ['required', 'in:male,female'],
            'year_level' => ['required', 'integer', 'between:1,4'],
        ]);

        return [
            ...$validated,
            'year_level' => (int) $validated['year_level'],
        ];
    }
}
