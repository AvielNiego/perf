/*
 * thread_demo.c - Multi-threaded busy work
 *
 * Performance characteristic: Creates 4 worker threads that each
 * perform CPU-bound work. Demonstrates multi-threaded profiling
 * with perf, showing per-thread CPU usage.
 *
 * Compile: gcc -g -O2 -Wall -o thread_demo thread_demo.c -lpthread -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <math.h>
#include <stdint.h>

#define NUM_THREADS 4
#define WORK_PER_THREAD 100000000

typedef struct {
    int thread_id;
    int64_t iterations;
    double result;
} thread_arg_t;

__attribute__((noinline))
void *worker_compute(void *arg) {
    thread_arg_t *ta = (thread_arg_t *)arg;
    double acc = 0.0;

    for (int64_t i = 0; i < ta->iterations; i++) {
        acc += sin((double)i * 0.000001) * cos((double)i * 0.000002);
    }

    ta->result = acc;
    printf("Thread %d finished: result = %f\n", ta->thread_id, acc);
    return NULL;
}

int main(void) {
    pthread_t threads[NUM_THREADS];
    thread_arg_t args[NUM_THREADS];

    printf("Starting %d worker threads, each doing %d iterations...\n",
           NUM_THREADS, WORK_PER_THREAD);

    for (int i = 0; i < NUM_THREADS; i++) {
        args[i].thread_id = i;
        args[i].iterations = WORK_PER_THREAD;
        args[i].result = 0.0;
        if (pthread_create(&threads[i], NULL, worker_compute, &args[i]) != 0) {
            fprintf(stderr, "Failed to create thread %d\n", i);
            return 1;
        }
    }

    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    double total = 0.0;
    for (int i = 0; i < NUM_THREADS; i++) {
        total += args[i].result;
    }

    printf("All threads done. Combined result: %f\n", total);
    return 0;
}
