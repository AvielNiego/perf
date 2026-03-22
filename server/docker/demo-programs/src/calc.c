/*
 * calc.c - Simple calculator with multiple functions
 *
 * Performance characteristic: Has multiple small, well-named functions.
 * Used to demonstrate the difference between profiling with and without
 * debug symbols (compiled with -g vs without). Students can see how
 * symbols help identify functions in perf output.
 *
 * Compile with symbols:    gcc -g -O2 -Wall -o calc_debug calc.c -lm
 * Compile without symbols: gcc -O2 -Wall -o calc_stripped calc.c -lm && strip calc_stripped
 */

#include <stdio.h>
#include <math.h>
#include <stdint.h>

#define ITERATIONS 10000000

volatile double result_sink = 0.0;

__attribute__((noinline))
double add_values(double a, double b) {
    return a + b;
}

__attribute__((noinline))
double subtract_values(double a, double b) {
    return a - b;
}

__attribute__((noinline))
double multiply_values(double a, double b) {
    return a * b;
}

__attribute__((noinline))
double divide_values(double a, double b) {
    if (b == 0.0) return 0.0;
    return a / b;
}

__attribute__((noinline))
double power_values(double base, double exp) {
    return pow(base, exp);
}

__attribute__((noinline))
double sqrt_value(double a) {
    return sqrt(fabs(a));
}

__attribute__((noinline))
double run_calculations(int iterations) {
    double acc = 1.0;

    for (int i = 1; i <= iterations; i++) {
        double x = (double)i * 0.0001;

        acc = add_values(acc, x);
        acc = multiply_values(acc, 1.000001);
        acc = subtract_values(acc, x * 0.5);
        acc = divide_values(acc, 1.000001);

        if (i % 100 == 0) {
            acc = sqrt_value(acc);
            acc = power_values(acc, 1.001);
        }
    }

    return acc;
}

int main(void) {
    printf("Calculator Demo\n");
    printf("================\n");
    printf("Running %d iterations of mixed arithmetic...\n", ITERATIONS);

    double answer = run_calculations(ITERATIONS);
    result_sink = answer;

    printf("Result: %f\n", answer);
    printf("\nCompare profiling with/without debug symbols:\n");
    printf("  perf record ./calc_debug   -> function names visible\n");
    printf("  perf record ./calc_stripped -> only addresses shown\n");

    return 0;
}
