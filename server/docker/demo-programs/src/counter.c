/*
 * counter.c - Simple CPU-bound counter
 *
 * Performance characteristic: Pure CPU-bound workload.
 * Counts to 1 billion in a tight loop. Demonstrates high IPC
 * since the loop body is trivial and predictable.
 *
 * Compile: gcc -g -O2 -Wall -o counter counter.c
 */

#include <stdio.h>
#include <stdint.h>

volatile int64_t counter = 0;

__attribute__((noinline))
void count_loop(int64_t limit) {
    for (int64_t i = 0; i < limit; i++) {
        counter = i;
    }
}

int main(void) {
    const int64_t LIMIT = 1000000000LL; /* 1 billion */

    printf("Counting to %lld...\n", (long long)LIMIT);
    count_loop(LIMIT);
    printf("Done. Final value: %lld\n", (long long)counter);

    return 0;
}
