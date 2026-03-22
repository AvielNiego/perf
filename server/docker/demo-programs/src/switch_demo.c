/*
 * switch_demo.c - High context switch rate demonstration
 *
 * Performance characteristic: Creates many threads that yield
 * frequently using sched_yield(), causing a very high context
 * switch count. Useful for demonstrating perf stat context-switch
 * counting.
 *
 * Compile: gcc -g -O2 -Wall -o switch_demo switch_demo.c -lpthread
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <sched.h>
#include <stdint.h>
#include <time.h>

#define NUM_THREADS 16
#define YIELDS_PER_THREAD 500000

volatile int64_t total_yields = 0;

__attribute__((noinline))
void *yield_worker(void *arg) {
    int thread_id = *(int *)arg;
    (void)thread_id;

    for (int i = 0; i < YIELDS_PER_THREAD; i++) {
        sched_yield();
        /* Small bit of work between yields */
        __sync_fetch_and_add(&total_yields, 1);
    }

    return NULL;
}

int main(void) {
    pthread_t threads[NUM_THREADS];
    int thread_ids[NUM_THREADS];

    printf("Context Switch Demo\n");
    printf("Creating %d threads, each yielding %d times...\n",
           NUM_THREADS, YIELDS_PER_THREAD);

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int i = 0; i < NUM_THREADS; i++) {
        thread_ids[i] = i;
        if (pthread_create(&threads[i], NULL, yield_worker, &thread_ids[i]) != 0) {
            fprintf(stderr, "Failed to create thread %d\n", i);
            return 1;
        }
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("Total yields: %lld\n", (long long)total_yields);
    printf("Elapsed: %.3f seconds\n", elapsed);
    printf("Yields/sec: %.0f\n", (double)total_yields / elapsed);
    printf("Use 'perf stat' to see context-switch count!\n");

    return 0;
}
