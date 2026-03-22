/*
 * deep_calls.c - Deep call chain demonstration
 *
 * Performance characteristic: Demonstrates a deep call chain that
 * perf can capture via call graphs. The chain is:
 *   main -> process -> compute -> calculate -> inner_loop
 * inner_loop does 90%+ of the actual work. Useful for demonstrating
 * perf record -g and flame graphs.
 *
 * Compile: gcc -g -O2 -Wall -o deep_calls deep_calls.c -lm
 *          (use -fno-inline to preserve call chain in perf output)
 */

#include <stdio.h>
#include <math.h>
#include <stdint.h>

volatile double sink = 0.0;

__attribute__((noinline))
double inner_loop(int iterations) {
    double acc = 0.0;
    for (int i = 0; i < iterations; i++) {
        acc += sin((double)i * 0.000001) * cos((double)i * 0.000002);
        acc += sqrt(fabs(acc) + 1.0);
    }
    return acc;
}

__attribute__((noinline))
double calculate(int iterations) {
    /* Small amount of local work */
    double local = 0.0;
    for (int i = 0; i < 1000; i++) {
        local += (double)i * 0.001;
    }
    /* Delegate to inner_loop for the heavy lifting */
    return inner_loop(iterations) + local;
}

__attribute__((noinline))
double compute(int iterations) {
    /* Minimal overhead */
    double overhead = 0.0;
    for (int i = 0; i < 500; i++) {
        overhead += (double)i * 0.01;
    }
    return calculate(iterations) + overhead;
}

__attribute__((noinline))
double process(int iterations) {
    /* Setup work - very small */
    printf("Processing %d iterations...\n", iterations);
    return compute(iterations);
}

int main(void) {
    const int ITERATIONS = 80000000;

    printf("Deep Call Chain Demo\n");
    printf("Call chain: main -> process -> compute -> calculate -> inner_loop\n");
    printf("inner_loop should dominate (~90%% of time)\n\n");

    double result = process(ITERATIONS);
    sink = result;

    printf("\nResult: %f\n", result);
    printf("Done. Use 'perf record -g' and 'perf report' to see the call chain.\n");

    return 0;
}
