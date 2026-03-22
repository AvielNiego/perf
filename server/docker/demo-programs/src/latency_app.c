/*
 * latency_app.c - Server-like program with scheduling latency issues
 *
 * Performance characteristic: Simulates a server with worker threads.
 * Some "high priority" threads hog the CPU with busy loops while
 * "low priority" threads get starved and experience high scheduling
 * latency. Demonstrates perf sched analysis.
 *
 * Compile: gcc -g -O2 -Wall -o latency_app latency_app.c -lpthread -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <math.h>
#include <time.h>
#include <unistd.h>
#include <stdint.h>
#include <string.h>

#define NUM_HOG_THREADS 4
#define NUM_STARVED_THREADS 4
#define RUNTIME_SEC 6

volatile int running = 1;
volatile double hog_sink = 0.0;

typedef struct {
    int thread_id;
    const char *role;
    int64_t wake_count;
    double max_latency_us;
    double total_latency_us;
} thread_stats_t;

/*
 * CPU hog thread: runs a tight compute loop that rarely yields,
 * consuming CPU and causing other threads to wait.
 */
__attribute__((noinline))
void *cpu_hog_worker(void *arg) {
    thread_stats_t *stats = (thread_stats_t *)arg;
    double acc = 1.0;

    while (running) {
        /* Long burst of CPU work without yielding */
        for (int i = 0; i < 5000000; i++) {
            acc = sin(acc) + cos(acc * 0.5);
        }
        hog_sink = acc;
        stats->wake_count++;
    }

    return NULL;
}

/*
 * Starved thread: tries to wake up periodically to do small work,
 * but gets delayed by the hog threads. Measures its own wake latency.
 */
__attribute__((noinline))
void *starved_worker(void *arg) {
    thread_stats_t *stats = (thread_stats_t *)arg;
    struct timespec req = {0, 1000000}; /* Request 1ms sleep */

    while (running) {
        struct timespec before, after;
        clock_gettime(CLOCK_MONOTONIC, &before);

        nanosleep(&req, NULL);

        clock_gettime(CLOCK_MONOTONIC, &after);

        double actual_us = ((after.tv_sec - before.tv_sec) * 1e6) +
                           ((after.tv_nsec - before.tv_nsec) / 1e3);
        double latency = actual_us - 1000.0; /* Subtract requested 1ms */
        if (latency < 0) latency = 0;

        if (latency > stats->max_latency_us) {
            stats->max_latency_us = latency;
        }
        stats->total_latency_us += latency;
        stats->wake_count++;
    }

    return NULL;
}

int main(void) {
    printf("Scheduling Latency Demo\n");
    printf("========================\n");
    printf("%d CPU hog threads + %d latency-sensitive threads\n",
           NUM_HOG_THREADS, NUM_STARVED_THREADS);
    printf("Running for %d seconds...\n\n", RUNTIME_SEC);

    pthread_t hog_threads[NUM_HOG_THREADS];
    pthread_t starved_threads[NUM_STARVED_THREADS];
    thread_stats_t hog_stats[NUM_HOG_THREADS];
    thread_stats_t starved_stats[NUM_STARVED_THREADS];

    memset(hog_stats, 0, sizeof(hog_stats));
    memset(starved_stats, 0, sizeof(starved_stats));

    /* Start hog threads */
    for (int i = 0; i < NUM_HOG_THREADS; i++) {
        hog_stats[i].thread_id = i;
        hog_stats[i].role = "hog";
        pthread_create(&hog_threads[i], NULL, cpu_hog_worker, &hog_stats[i]);
    }

    /* Start starved threads */
    for (int i = 0; i < NUM_STARVED_THREADS; i++) {
        starved_stats[i].thread_id = i;
        starved_stats[i].role = "starved";
        pthread_create(&starved_threads[i], NULL, starved_worker, &starved_stats[i]);
    }

    /* Let it run */
    sleep(RUNTIME_SEC);
    running = 0;

    /* Join all threads */
    for (int i = 0; i < NUM_HOG_THREADS; i++) {
        pthread_join(hog_threads[i], NULL);
    }
    for (int i = 0; i < NUM_STARVED_THREADS; i++) {
        pthread_join(starved_threads[i], NULL);
    }

    /* Report results */
    printf("CPU Hog Threads:\n");
    for (int i = 0; i < NUM_HOG_THREADS; i++) {
        printf("  Hog %d: %lld work loops\n",
               i, (long long)hog_stats[i].wake_count);
    }

    printf("\nStarved Threads (requesting 1ms sleeps):\n");
    for (int i = 0; i < NUM_STARVED_THREADS; i++) {
        double avg = starved_stats[i].wake_count > 0 ?
                     starved_stats[i].total_latency_us / starved_stats[i].wake_count : 0;
        printf("  Starved %d: %lld wakes, avg extra latency: %.1f us, max: %.1f us\n",
               i, (long long)starved_stats[i].wake_count,
               avg, starved_stats[i].max_latency_us);
    }

    printf("\nUse 'perf sched record' and 'perf sched latency' to analyze!\n");

    return 0;
}
