/*
 * io_heavy_app.c - I/O-heavy application
 *
 * Performance characteristic: Creates many small temporary files and
 * reads them back, generating I/O wait. CPU utilization is low but
 * the program is slow due to I/O. Good for demonstrating off-CPU
 * analysis and the difference between CPU time and wall time.
 *
 * Compile: gcc -g -O2 -Wall -o io_heavy_app io_heavy_app.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <time.h>

#define NUM_FILES 2000
#define FILE_SIZE 4096
#define TMP_DIR "/tmp/io_heavy_demo"

volatile int64_t bytes_read = 0;

__attribute__((noinline))
void create_files(int count) {
    char buf[FILE_SIZE];
    memset(buf, 'X', sizeof(buf));

    for (int i = 0; i < count; i++) {
        char path[256];
        snprintf(path, sizeof(path), TMP_DIR "/file_%05d.dat", i);

        int fd = open(path, O_WRONLY | O_CREAT | O_TRUNC, 0644);
        if (fd < 0) continue;
        write(fd, buf, FILE_SIZE);
        fsync(fd);  /* Force write to disk */
        close(fd);
    }
}

__attribute__((noinline))
void read_files(int count) {
    char buf[FILE_SIZE];

    for (int i = 0; i < count; i++) {
        char path[256];
        snprintf(path, sizeof(path), TMP_DIR "/file_%05d.dat", i);

        int fd = open(path, O_RDONLY);
        if (fd < 0) continue;

        ssize_t n = read(fd, buf, FILE_SIZE);
        if (n > 0) bytes_read += n;
        close(fd);
    }
}

__attribute__((noinline))
void read_files_random(int count) {
    char buf[FILE_SIZE];

    /* Read in random order to defeat OS read-ahead */
    int *order = malloc(count * sizeof(int));
    if (!order) return;

    for (int i = 0; i < count; i++) order[i] = i;
    for (int i = count - 1; i > 0; i--) {
        int j = rand() % (i + 1);
        int tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }

    for (int i = 0; i < count; i++) {
        char path[256];
        snprintf(path, sizeof(path), TMP_DIR "/file_%05d.dat", order[i]);

        int fd = open(path, O_RDONLY);
        if (fd < 0) continue;

        ssize_t n = read(fd, buf, FILE_SIZE);
        if (n > 0) bytes_read += n;
        close(fd);
    }

    free(order);
}

__attribute__((noinline))
void cleanup_files(int count) {
    for (int i = 0; i < count; i++) {
        char path[256];
        snprintf(path, sizeof(path), TMP_DIR "/file_%05d.dat", i);
        unlink(path);
    }
    rmdir(TMP_DIR);
}

int main(void) {
    srand(42);

    printf("I/O Heavy App\n");
    printf("==============\n");
    printf("This program creates, reads, and deletes %d small files.\n\n", NUM_FILES);

    mkdir(TMP_DIR, 0755);

    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);

    printf("Phase 1: Creating %d files with fsync...\n", NUM_FILES);
    create_files(NUM_FILES);

    printf("Phase 2: Sequential read...\n");
    read_files(NUM_FILES);

    printf("Phase 3: Random read...\n");
    read_files_random(NUM_FILES);

    printf("Phase 4: Cleanup...\n");
    cleanup_files(NUM_FILES);

    clock_gettime(CLOCK_MONOTONIC, &end);
    double elapsed = (end.tv_sec - start.tv_sec) +
                     (end.tv_nsec - start.tv_nsec) / 1e9;

    printf("\nTotal bytes read: %lld\n", (long long)bytes_read);
    printf("Elapsed: %.3f seconds\n", elapsed);
    printf("Note: CPU usage will be low - most time is I/O wait!\n");
    printf("Use 'perf stat' to see low instructions-per-cycle.\n");

    return 0;
}
