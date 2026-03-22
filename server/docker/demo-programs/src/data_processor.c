/*
 * data_processor.c - Record processing for perf probe demonstration
 *
 * Performance characteristic: Has a process_record() function that is
 * called many times with different record types. Good for demonstrating
 * perf probe to trace function entry/exit, measure per-call latency,
 * and inspect function arguments.
 *
 * Compile: gcc -g -O2 -Wall -o data_processor data_processor.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <stdint.h>
#include <time.h>

#define NUM_RECORDS 5000000

typedef enum {
    RECORD_TYPE_A = 0, /* Simple - fast processing */
    RECORD_TYPE_B = 1, /* Medium - moderate processing */
    RECORD_TYPE_C = 2, /* Complex - slow processing */
    NUM_RECORD_TYPES
} record_type_t;

typedef struct {
    int id;
    record_type_t type;
    double value;
} record_t;

volatile double output_sink = 0.0;

__attribute__((noinline))
double process_simple(double value) {
    return value * 2.0 + 1.0;
}

__attribute__((noinline))
double process_medium(double value) {
    double result = value;
    for (int i = 0; i < 10; i++) {
        result = result * 1.01 + 0.5;
    }
    return result;
}

__attribute__((noinline))
double process_complex(double value) {
    double result = value;
    for (int i = 0; i < 50; i++) {
        result = sin(result) + cos(result * 0.5);
        result = sqrt(fabs(result) + 1.0);
    }
    return result;
}

__attribute__((noinline))
double process_record(record_t *record) {
    /*
     * This is the main function to probe with perf:
     *   perf probe -x ./data_processor process_record
     *   perf probe -x ./data_processor process_record%return
     *   perf record -e probe_data_processor:process_record ...
     */
    double result;

    switch (record->type) {
        case RECORD_TYPE_A:
            result = process_simple(record->value);
            break;
        case RECORD_TYPE_B:
            result = process_medium(record->value);
            break;
        case RECORD_TYPE_C:
            result = process_complex(record->value);
            break;
        default:
            result = record->value;
            break;
    }

    return result;
}

__attribute__((noinline))
void generate_records(record_t *records, int count) {
    for (int i = 0; i < count; i++) {
        records[i].id = i;
        /* Distribution: 70% type A, 20% type B, 10% type C */
        int r = i % 10;
        if (r < 7)
            records[i].type = RECORD_TYPE_A;
        else if (r < 9)
            records[i].type = RECORD_TYPE_B;
        else
            records[i].type = RECORD_TYPE_C;
        records[i].value = (double)i * 0.001;
    }
}

int main(void) {
    printf("Data Processor Demo\n");
    printf("====================\n");
    printf("Processing %d records...\n", NUM_RECORDS);

    record_t *records = malloc(NUM_RECORDS * sizeof(record_t));
    if (!records) {
        fprintf(stderr, "Failed to allocate records\n");
        return 1;
    }

    generate_records(records, NUM_RECORDS);

    int type_counts[NUM_RECORD_TYPES] = {0};
    double total = 0.0;

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    for (int i = 0; i < NUM_RECORDS; i++) {
        total += process_record(&records[i]);
        type_counts[records[i].type]++;
    }

    clock_gettime(CLOCK_MONOTONIC, &end);
    output_sink = total;

    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("\nResults:\n");
    printf("  Type A (simple):  %d records\n", type_counts[0]);
    printf("  Type B (medium):  %d records\n", type_counts[1]);
    printf("  Type C (complex): %d records\n", type_counts[2]);
    printf("  Total output: %f\n", total);
    printf("  Elapsed: %.3f seconds\n", elapsed);
    printf("\nTry: perf probe -x ./data_processor 'process_record record->type'\n");

    free(records);
    return 0;
}
