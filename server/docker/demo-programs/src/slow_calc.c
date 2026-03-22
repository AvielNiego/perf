/*
 * slow_calc.c - Expensive floating-point computation
 *
 * Performance characteristic: Low IPC (< 0.5) due to long-latency
 * floating-point operations with data dependencies. Each iteration
 * depends on the previous result, preventing pipelining.
 *
 * Compile: gcc -g -O2 -Wall -o slow_calc slow_calc.c -lm
 */

#include <stdio.h>
#include <math.h>

volatile double result = 0.0;

__attribute__((noinline))
double hot_loop(int iterations) {
    double acc = 1.0;
    for (int i = 1; i <= iterations; i++) {
        /* Chain of dependent FP ops - each depends on previous result */
        acc = sin(acc) + cos((double)i * 0.0001);
        acc = sqrt(fabs(acc)) * log(fabs(acc) + 1.0);
        acc += tan(acc * 0.001) / (1.0 + fabs(acc));
    }
    return acc;
}

int main(void) {
    const int ITERATIONS = 20000000;

    printf("Running expensive floating-point computation...\n");
    printf("Iterations: %d\n", ITERATIONS);

    result = hot_loop(ITERATIONS);

    printf("Result: %f\n", result);
    printf("Done.\n");

    return 0;
}
