/*
 * workload_mix.c - Alternating CPU-heavy and IO-heavy phases
 *
 * Performance characteristic: Alternates between CPU-heavy phases
 * (floating-point computation) and IO-heavy phases (file writes)
 * every 2 seconds. Good for demonstrating 'perf top' where you
 * can see the workload profile change over time.
 *
 * Compile: gcc -g -O2 -Wall -o workload_mix workload_mix.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <fcntl.h>

#define PHASE_DURATION_SEC 2
#define NUM_CYCLES 3

volatile double compute_result = 0.0;

__attribute__((noinline))
void cpu_intensive_phase(int duration_sec) {
    struct timespec start, now;
    clock_gettime(CLOCK_MONOTONIC, &start);

    double acc = 1.0;
    long long ops = 0;

    while (1) {
        for (int i = 0; i < 100000; i++) {
            acc = sin(acc) + cos(acc * 0.5);
            acc = sqrt(fabs(acc) + 1.0);
            ops++;
        }
        compute_result = acc;

        clock_gettime(CLOCK_MONOTONIC, &now);
        double elapsed = (now.tv_sec - start.tv_sec) +
                         (now.tv_nsec - start.tv_nsec) / 1e9;
        if (elapsed >= (double)duration_sec) break;
    }

    printf("    CPU phase: %lld operations\n", ops);
}

__attribute__((noinline))
void io_intensive_phase(int duration_sec) {
    struct timespec start, now;
    clock_gettime(CLOCK_MONOTONIC, &start);

    char buf[4096];
    memset(buf, 'Z', sizeof(buf));
    long long writes = 0;

    int fd = open("/dev/null", O_WRONLY);
    if (fd < 0) {
        fprintf(stderr, "Cannot open /dev/null\n");
        return;
    }

    while (1) {
        for (int i = 0; i < 1000; i++) {
            write(fd, buf, sizeof(buf));
            writes++;
        }

        /* Add some small file operations for variety */
        FILE *tmp = tmpfile();
        if (tmp) {
            fwrite(buf, 1, sizeof(buf), tmp);
            fflush(tmp);
            fclose(tmp);
        }

        clock_gettime(CLOCK_MONOTONIC, &now);
        double elapsed = (now.tv_sec - start.tv_sec) +
                         (now.tv_nsec - start.tv_nsec) / 1e9;
        if (elapsed >= (double)duration_sec) break;
    }

    close(fd);
    printf("    I/O phase: %lld writes\n", writes);
}

int main(void) {
    printf("Workload Mix Demo\n");
    printf("==================\n");
    printf("Alternating between CPU and I/O phases (%d sec each)\n",
           PHASE_DURATION_SEC);
    printf("Run 'perf top' in another terminal to watch the profile change!\n\n");

    for (int cycle = 0; cycle < NUM_CYCLES; cycle++) {
        printf("Cycle %d/%d:\n", cycle + 1, NUM_CYCLES);

        printf("  [CPU Phase]\n");
        cpu_intensive_phase(PHASE_DURATION_SEC);

        printf("  [I/O Phase]\n");
        io_intensive_phase(PHASE_DURATION_SEC);
    }

    printf("\nDone. Total runtime: ~%d seconds\n",
           NUM_CYCLES * PHASE_DURATION_SEC * 2);

    return 0;
}
