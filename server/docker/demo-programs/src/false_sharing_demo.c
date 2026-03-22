/*
 * false_sharing_demo.c - False sharing demonstration
 *
 * Performance characteristic: Multiple threads increment adjacent
 * counters in a shared struct. When counters share a cache line,
 * the line bounces between cores (false sharing), degrading performance.
 * The --padded version separates counters to different cache lines.
 *
 * Compile: gcc -g -O2 -Wall -o false_sharing_demo false_sharing_demo.c -lpthread
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <stdint.h>
#include <time.h>

#define NUM_THREADS 4
#define INCREMENTS 100000000

/* False sharing: all counters packed into the same cache line(s) */
typedef struct {
    volatile int64_t counters[NUM_THREADS];
} shared_counters_t;

/* No false sharing: each counter on its own cache line */
typedef struct {
    volatile int64_t counter;
    char padding[56]; /* Pad to 64 bytes (typical cache line size) */
} padded_counter_t;

typedef struct {
    int thread_id;
    int use_padded;
    shared_counters_t *shared;
    padded_counter_t *padded;
} thread_arg_t;

void *increment_worker(void *arg) {
    thread_arg_t *ta = (thread_arg_t *)arg;
    int id = ta->thread_id;

    if (ta->use_padded) {
        for (int i = 0; i < INCREMENTS; i++) {
            ta->padded[id].counter++;
        }
    } else {
        for (int i = 0; i < INCREMENTS; i++) {
            ta->shared->counters[id]++;
        }
    }

    return NULL;
}

double run_test(int use_padded) {
    pthread_t threads[NUM_THREADS];
    thread_arg_t args[NUM_THREADS];

    shared_counters_t shared;
    memset(&shared, 0, sizeof(shared));

    padded_counter_t *padded = calloc(NUM_THREADS, sizeof(padded_counter_t));
    if (!padded) {
        fprintf(stderr, "Allocation failed\n");
        return -1.0;
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        args[i].thread_id = i;
        args[i].use_padded = use_padded;
        args[i].shared = &shared;
        args[i].padded = padded;
    }

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_create(&threads[i], NULL, increment_worker, &args[i]);
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    /* Verify counts */
    int64_t total = 0;
    for (int i = 0; i < NUM_THREADS; i++) {
        total += use_padded ? padded[i].counter : shared.counters[i];
    }
    printf("  Total increments: %lld (expected %lld)\n",
           (long long)total, (long long)NUM_THREADS * INCREMENTS);

    free(padded);
    return elapsed;
}

int main(int argc, char *argv[]) {
    int use_padded = 0;

    if (argc > 1 && strcmp(argv[1], "--padded") == 0) {
        use_padded = 1;
    }

    printf("False Sharing Demo\n");
    printf("===================\n");
    printf("%d threads, %d increments each\n\n", NUM_THREADS, INCREMENTS);

    if (use_padded) {
        printf("Mode: PADDED (no false sharing)\n");
        printf("Each counter on its own cache line.\n\n");
        double elapsed = run_test(1);
        printf("  Time: %.3f seconds\n", elapsed);
    } else {
        printf("Mode: PACKED (false sharing)\n");
        printf("All counters on adjacent memory (same cache line).\n\n");
        double elapsed = run_test(0);
        printf("  Time: %.3f seconds\n", elapsed);
        printf("\nRun with --padded to compare without false sharing.\n");
    }

    printf("\nUse 'perf stat -e cache-misses,cache-references' to compare!\n");

    return 0;
}
