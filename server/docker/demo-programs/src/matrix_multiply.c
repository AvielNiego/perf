/*
 * matrix_multiply.c - Naive vs optimized matrix multiplication
 *
 * Performance characteristic: Compares two matrix multiplication orders:
 *   1. naive_multiply (ijk) - cache-unfriendly: inner loop strides
 *      through columns of B, causing cache misses
 *   2. optimized_multiply (ikj) - cache-friendly: inner loop accesses
 *      rows of both B and C sequentially
 * Demonstrates how loop order affects cache performance dramatically.
 *
 * Compile: gcc -g -O2 -Wall -o matrix_multiply matrix_multiply.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define N 1024  /* Matrix dimension */

static double A[N][N];
static double B[N][N];
static double C[N][N];

__attribute__((noinline))
void init_matrices(void) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            A[i][j] = (double)(i + j) * 0.001;
            B[i][j] = (double)(i - j) * 0.001;
        }
    }
}

__attribute__((noinline))
void naive_multiply(void) {
    /* ijk order: B[k][j] strides through columns - cache unfriendly */
    memset(C, 0, sizeof(C));
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            double sum = 0.0;
            for (int k = 0; k < N; k++) {
                sum += A[i][k] * B[k][j];
            }
            C[i][j] = sum;
        }
    }
}

__attribute__((noinline))
void optimized_multiply(void) {
    /* ikj order: both B[k][j] and C[i][j] access rows - cache friendly */
    memset(C, 0, sizeof(C));
    for (int i = 0; i < N; i++) {
        for (int k = 0; k < N; k++) {
            double a_ik = A[i][k];
            for (int j = 0; j < N; j++) {
                C[i][j] += a_ik * B[k][j];
            }
        }
    }
}

__attribute__((noinline))
double checksum(void) {
    double sum = 0.0;
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            sum += C[i][j];
        }
    }
    return sum;
}

int main(void) {
    struct timespec start, end;

    printf("Matrix Multiplication Benchmark (%dx%d)\n", N, N);
    printf("========================================\n\n");

    init_matrices();

    /* Naive (ijk) multiplication */
    printf("Running naive multiply (ijk order, cache-unfriendly)...\n");
    clock_gettime(CLOCK_MONOTONIC, &start);
    naive_multiply();
    clock_gettime(CLOCK_MONOTONIC, &end);
    double naive_time = (end.tv_sec - start.tv_sec) +
                        (end.tv_nsec - start.tv_nsec) / 1e9;
    double naive_check = checksum();
    printf("  Time: %.3f seconds, checksum: %.6f\n\n", naive_time, naive_check);

    /* Optimized (ikj) multiplication */
    printf("Running optimized multiply (ikj order, cache-friendly)...\n");
    clock_gettime(CLOCK_MONOTONIC, &start);
    optimized_multiply();
    clock_gettime(CLOCK_MONOTONIC, &end);
    double opt_time = (end.tv_sec - start.tv_sec) +
                      (end.tv_nsec - start.tv_nsec) / 1e9;
    double opt_check = checksum();
    printf("  Time: %.3f seconds, checksum: %.6f\n\n", opt_time, opt_check);

    printf("Speedup: %.2fx\n", naive_time / opt_time);
    printf("Both checksums match: %s\n",
           (naive_check == opt_check) ? "YES" : "NO (floating point rounding)");

    return 0;
}
