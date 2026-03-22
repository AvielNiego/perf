/*
 * mem_speed.c - Memory hierarchy benchmark
 *
 * Performance characteristic: Measures access latency at different
 * memory hierarchy levels by accessing arrays of increasing size.
 * Small array fits in L1, medium in L2, large in L3, huge goes to RAM.
 * Demonstrates the memory wall and cache hierarchy effects.
 *
 * Compile: gcc -g -O2 -Wall -o mem_speed mem_speed.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define KB (1024)
#define MB (1024 * 1024)

/* Number of accesses per test - enough to get stable timing */
#define NUM_ACCESSES (64 * 1024 * 1024)

volatile int sink = 0;

/*
 * Pointer-chasing benchmark: follow a chain of pointers through
 * the array to measure latency. The chain is arranged so that
 * accesses are spread across the entire array size.
 */
__attribute__((noinline))
double measure_latency(int *array, size_t array_size, size_t num_accesses) {
    size_t num_elements = array_size / sizeof(int);

    /* Create a random pointer-chase chain */
    for (size_t i = 0; i < num_elements; i++) {
        array[i] = (int)((i + 127) % num_elements);
    }

    /* Warm up */
    int idx = 0;
    for (size_t i = 0; i < num_elements; i++) {
        idx = array[idx];
    }
    sink = idx;

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    idx = 0;
    for (size_t i = 0; i < num_accesses; i++) {
        idx = array[idx];
    }
    sink = idx;

    clock_gettime(CLOCK_MONOTONIC, &end);

    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;
    return (elapsed / (double)num_accesses) * 1e9; /* nanoseconds per access */
}

int main(void) {
    struct {
        const char *name;
        size_t size;
    } levels[] = {
        { "L1  (16 KB)",   16 * KB  },
        { "L2  (256 KB)",  256 * KB },
        { "L3  (4 MB)",    4 * MB   },
        { "RAM (64 MB)",   64 * MB  },
    };
    int num_levels = sizeof(levels) / sizeof(levels[0]);

    printf("Memory Hierarchy Benchmark\n");
    printf("==========================\n");
    printf("%-16s %10s %12s\n", "Level", "Size", "Latency (ns)");
    printf("%-16s %10s %12s\n", "-----", "----", "------------");

    /* Allocate the largest array needed */
    size_t max_size = levels[num_levels - 1].size;
    int *array = malloc(max_size);
    if (!array) {
        fprintf(stderr, "Failed to allocate %zu bytes\n", max_size);
        return 1;
    }

    for (int l = 0; l < num_levels; l++) {
        size_t accesses = NUM_ACCESSES;
        /* Fewer accesses for smaller arrays to keep timing reasonable */
        if (levels[l].size <= 256 * KB) {
            accesses = NUM_ACCESSES / 2;
        }

        double latency = measure_latency(array, levels[l].size, accesses);
        printf("%-16s %7zu KB %10.1f ns\n",
               levels[l].name,
               levels[l].size / KB,
               latency);
    }

    printf("\nNote: Actual latencies depend on your CPU's cache sizes.\n");

    free(array);
    return 0;
}
