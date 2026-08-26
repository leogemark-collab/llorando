<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->name(),
             'last_name' => fake()->lastname(),
             'email' => fake()->unique()->safeEmail(),
             'program' => fake()->randomElement([
                'BSIT',
                'BSCS',
                'BSIS',
             ]),
             'gender' => fake()->RandomElement([
                'female',
                'male',

        ]),
             'birthday' => fake()
             ->dateTimeBetween('-25 years', '-17 years')
             ->format('Y-m-d'),
             'year_level' => fake()->numberBetween(1,4),

        
             
        ];
    }
}


