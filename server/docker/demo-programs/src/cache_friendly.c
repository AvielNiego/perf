/*
 * cache_friendly.c - Sequential array access (good cache behavior)
 *
 * Performance characteristic: Low cache miss rate. Iterates through
 * a large array sequentially, which is ideal for hardware prefetching
 * and cache line utilization. Compare with cache_unfriendly.c.
 *
 * Compile: gcc -g -O2 -Wall -o cache_friendly cache_friendly.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define ARRAY_SIZE (64 * 1024 * 1024) /* 64M integers = 256 MB */
#define NUM_PASSES 3

volatile int64_t sink = 0;

__attribute__((noinline))
void sequential_access(int *array, size_t size) {
    int64_t sum = 0;
    for (size_t i = 0; i < size; i++) {
        sum += array[i];
    }
    sink = sum;
}

int main(void) {
    int *array = malloc(ARRAY_SIZE * sizeof(int));
    if (!array) {
        fprintf(stderr, "Failed to allocate memory\n");
        return 1;
    }

    /* Initialize array */
    for (size_t i = 0; i < ARRAY_SIZE; i++) {
        array[i] = (int)(i & 0xFF);
    }

    printf("Cache-friendly sequential access (%zu MB)\n",
           (ARRAY_SIZE * sizeof(int)) / (1024 * 1024));

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int pass = 0; pass < NUM_PASSES; pass++) {
        sequential_access(array, ARRAY_SIZE);
    }

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("Completed %d passes in %.3f seconds\n", NUM_PASSES, elapsed);
    printf("Bandwidth: %.1f MB/s\n",
           (double)(ARRAY_SIZE * sizeof(int)) * NUM_PASSES / (1024.0 * 1024.0) / elapsed);
    printf("sink = %lld\n", (long long)sink);

    free(array);
    return 0;
}
