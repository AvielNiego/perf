/*
 * complex_app.c - Multiple hotspots for flame graph analysis
 *
 * Performance characteristic: Has 3 different hotspots:
 *   1. heavy_compute() - CPU-bound floating-point work
 *   2. memory_intensive() - Memory-bound with large array traversal
 *   3. io_simulation() - Simulated I/O with syscalls (write to /dev/null)
 * Good for generating interesting flame graphs with multiple branches.
 *
 * Compile: gcc -g -O2 -Wall -o complex_app complex_app.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include <stdint.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>

#define ARRAY_SIZE (8 * 1024 * 1024)

volatile double compute_sink = 0.0;
volatile int64_t mem_sink = 0;

__attribute__((noinline))
double math_kernel(double x, int depth) {
    double result = x;
    for (int i = 0; i < depth; i++) {
        result = sin(result) + cos(result * 0.5);
        result = sqrt(fabs(result) + 1.0);
    }
    return result;
}

__attribute__((noinline))
void heavy_compute(int iterations) {
    printf("  Running heavy_compute (%d iterations)...\n", iterations);
    double acc = 1.0;
    for (int i = 0; i < iterations; i++) {
        acc = math_kernel(acc + (double)i * 0.000001, 5);
    }
    compute_sink = acc;
}

__attribute__((noinline))
void array_walk(int *array, size_t size) {
    int64_t sum = 0;
    for (size_t i = 0; i < size; i++) {
        sum += array[i];
    }
    mem_sink = sum;
}

__attribute__((noinline))
void memory_intensive(int passes) {
    printf("  Running memory_intensive (%d passes)...\n", passes);
    int *array = malloc(ARRAY_SIZE * sizeof(int));
    if (!array) return;

    for (size_t i = 0; i < ARRAY_SIZE; i++) {
        array[i] = (int)(i & 0xFFFF);
    }

    for (int p = 0; p < passes; p++) {
        array_walk(array, ARRAY_SIZE);
    }

    free(array);
}

__attribute__((noinline))
void io_simulation(int num_writes) {
    printf("  Running io_simulation (%d writes)...\n", num_writes);
    int fd = open("/dev/null", O_WRONLY);
    if (fd < 0) return;

    char buf[4096];
    memset(buf, 'A', sizeof(buf));

    for (int i = 0; i < num_writes; i++) {
        write(fd, buf, sizeof(buf));
    }

    close(fd);
}

__attribute__((noinline))
void run_workload(void) {
    heavy_compute(5000000);
    memory_intensive(10);
    io_simulation(200000);
}

int main(void) {
    printf("Complex App - Multiple Hotspots\n");
    printf("================================\n");

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    run_workload();

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("\nTotal time: %.3f seconds\n", elapsed);
    printf("Use 'perf record -g' and flamegraph tools to visualize!\n");

    return 0;
}
