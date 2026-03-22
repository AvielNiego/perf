/*
 * cache_unfriendly.c - Random array access (bad cache behavior)
 *
 * Performance characteristic: High cache miss rate. Accesses a large
 * array in random order, defeating hardware prefetching and causing
 * frequent cache misses at all levels. Compare with cache_friendly.c.
 *
 * Compile: gcc -g -O2 -Wall -o cache_unfriendly cache_unfriendly.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>

#define ARRAY_SIZE (16 * 1024 * 1024) /* 16M integers = 64 MB */
#define NUM_ACCESSES (32 * 1024 * 1024)

volatile int64_t sink = 0;

/* Fisher-Yates shuffle to create random index order */
__attribute__((noinline))
void shuffle_indices(int *indices, size_t size) {
    for (size_t i = 0; i < size; i++) {
        indices[i] = (int)i;
    }
    for (size_t i = size - 1; i > 0; i--) {
        size_t j = (size_t)rand() % (i + 1);
        int tmp = indices[i];
        indices[i] = indices[j];
        indices[j] = tmp;
    }
}

__attribute__((noinline))
void random_access(int *array, int *indices, size_t num_accesses) {
    int64_t sum = 0;
    size_t mask = ARRAY_SIZE - 1;
    for (size_t i = 0; i < num_accesses; i++) {
        sum += array[indices[i & mask]];
    }
    sink = sum;
}

int main(void) {
    srand(42);

    int *array = malloc(ARRAY_SIZE * sizeof(int));
    int *indices = malloc(ARRAY_SIZE * sizeof(int));
    if (!array || !indices) {
        fprintf(stderr, "Failed to allocate memory\n");
        return 1;
    }

    /* Initialize array */
    for (size_t i = 0; i < ARRAY_SIZE; i++) {
        array[i] = (int)(i & 0xFF);
    }

    printf("Generating random access pattern...\n");
    shuffle_indices(indices, ARRAY_SIZE);

    printf("Cache-unfriendly random access (%zu MB, %d accesses)\n",
           (ARRAY_SIZE * sizeof(int)) / (1024 * 1024), NUM_ACCESSES);

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    random_access(array, indices, NUM_ACCESSES);

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("Completed %d random accesses in %.3f seconds\n",
           NUM_ACCESSES, elapsed);
    printf("Effective bandwidth: %.1f MB/s\n",
           (double)(NUM_ACCESSES * sizeof(int)) / (1024.0 * 1024.0) / elapsed);
    printf("sink = %lld\n", (long long)sink);

    free(array);
    free(indices);
    return 0;
}
