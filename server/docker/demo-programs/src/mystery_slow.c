/*
 * mystery_slow.c - A program that's slow for non-obvious reasons
 *
 * Performance characteristic: Appears to be a simple data lookup
 * program, but inefficient_search() does a linear scan through a
 * large array with cache-unfriendly random comparisons. ~85% of
 * time should be spent in inefficient_search(). Students should
 * use perf to identify the bottleneck.
 *
 * Compile: gcc -g -O2 -Wall -o mystery_slow mystery_slow.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <time.h>

#define DATA_SIZE (4 * 1024 * 1024)  /* 4M entries */
#define NUM_LOOKUPS 200
#define STRIDE 4099  /* Prime stride for cache-unfriendly access */

typedef struct {
    int key;
    int value;
    char padding[56];  /* Pad to 64 bytes to waste cache lines */
} record_t;

volatile int64_t found_count = 0;

__attribute__((noinline))
void setup_data(record_t *data, size_t size) {
    for (size_t i = 0; i < size; i++) {
        data[i].key = (int)((i * 7 + 13) % size);
        data[i].value = (int)(i * 3);
        memset(data[i].padding, 0, sizeof(data[i].padding));
    }
}

__attribute__((noinline))
int inefficient_search(record_t *data, size_t size, int target) {
    /*
     * This is intentionally slow: linear scan with a prime stride
     * that defeats cache prefetching. A hash table or binary search
     * would be O(1) or O(log n), but this is O(n) with bad locality.
     */
    size_t idx = 0;
    for (size_t i = 0; i < size; i++) {
        if (data[idx].key == target) {
            return data[idx].value;
        }
        idx = (idx + STRIDE) % size;
    }
    return -1;
}

__attribute__((noinline))
void process_results(int *results, int count) {
    /* Light post-processing - not the bottleneck */
    int64_t sum = 0;
    for (int i = 0; i < count; i++) {
        sum += results[i];
    }
    found_count = sum;
}

int main(void) {
    record_t *data = malloc(DATA_SIZE * sizeof(record_t));
    if (!data) {
        fprintf(stderr, "Failed to allocate memory\n");
        return 1;
    }

    printf("Setting up data (%d records, %zu MB)...\n",
           DATA_SIZE, (DATA_SIZE * sizeof(record_t)) / (1024 * 1024));
    setup_data(data, DATA_SIZE);

    int results[NUM_LOOKUPS];
    printf("Performing %d lookups...\n", NUM_LOOKUPS);

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int i = 0; i < NUM_LOOKUPS; i++) {
        int target = (i * 31337) % DATA_SIZE;
        results[i] = inefficient_search(data, DATA_SIZE, target);
    }

    clock_gettime(CLOCK_MONOTONIC, &end);

    process_results(results, NUM_LOOKUPS);

    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("Lookups complete in %.3f seconds\n", elapsed);
    printf("Checksum: %lld\n", (long long)found_count);
    printf("\nWhy is this so slow? Use 'perf record' to find out!\n");

    free(data);
    return 0;
}
