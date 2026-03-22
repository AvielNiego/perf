/*
 * multi_path.c - Same function called from different paths
 *
 * Performance characteristic: The function compute() is called from
 * two different call paths: path_a() calls it in a tight loop (heavy),
 * while path_b() calls it just once (light). Demonstrates that the
 * same function can appear with different overhead depending on
 * its caller. Useful for perf report --children vs --no-children.
 *
 * Compile: gcc -g -O2 -Wall -o multi_path multi_path.c -lm
 */

#include <stdio.h>
#include <math.h>
#include <stdint.h>

volatile double sink = 0.0;

__attribute__((noinline))
double compute(int iterations) {
    double acc = 0.0;
    for (int i = 0; i < iterations; i++) {
        acc += sin((double)i * 0.0001) + cos((double)i * 0.0002);
    }
    return acc;
}

__attribute__((noinline))
double path_a(void) {
    /* Heavy path: calls compute() many times in a loop */
    double total = 0.0;
    printf("path_a: calling compute() 100 times with 500000 iterations each...\n");
    for (int round = 0; round < 100; round++) {
        total += compute(500000);
    }
    return total;
}

__attribute__((noinline))
double path_b(void) {
    /* Light path: calls compute() just once */
    printf("path_b: calling compute() once with 500000 iterations...\n");
    return compute(500000);
}

int main(void) {
    printf("Multi-Path Demo\n");
    printf("compute() is called from two paths with very different frequency.\n\n");

    double result_a = path_a();
    sink = result_a;

    double result_b = path_b();
    sink += result_b;

    printf("\npath_a result: %f (heavy - ~99%% of compute time)\n", result_a);
    printf("path_b result: %f (light - ~1%% of compute time)\n", result_b);
    printf("Use 'perf report -g' to see different call paths to compute().\n");

    return 0;
}
