/*
 * kingdom_registry_gen.c - Generate the kingdom_registry.txt file
 *
 * Generates a text file with 50 citizens for the PerfQuest game.
 * Each line has format: name,role,age
 * Roles: knight, mage, farmer, merchant, healer
 *
 * Compile: gcc -g -O2 -Wall -o kingdom_registry_gen kingdom_registry_gen.c
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define NUM_CITIZENS 50

static const char *first_names[] = {
    "Aldric", "Beatrix", "Cedric", "Diana", "Edmund",
    "Fiona", "Gareth", "Helena", "Ivan", "Julia",
    "Kael", "Luna", "Magnus", "Nora", "Osric",
    "Petra", "Quinn", "Rosalind", "Soren", "Thalia",
    "Uther", "Vivienne", "Wulfric", "Xena", "Yorick",
    "Zelda", "Alaric", "Brenna", "Corwin", "Dahlia",
    "Elric", "Freya", "Gideon", "Hilda", "Isolde",
    "Jasper", "Katarina", "Leander", "Mira", "Neville",
    "Ophelia", "Percival", "Rowena", "Silas", "Tatiana",
    "Ulric", "Vesper", "Wyatt", "Yara", "Zephyr"
};

static const char *roles[] = {
    "knight", "mage", "farmer", "merchant", "healer"
};

int main(void) {
    const char *output_file = "kingdom_registry.txt";
    FILE *fp = fopen(output_file, "w");
    if (!fp) {
        fprintf(stderr, "Failed to open %s for writing\n", output_file);
        return 1;
    }

    /*
     * Use a simple deterministic scheme for role/age assignment
     * so the output is reproducible.
     */
    unsigned int seed = 42;

    for (int i = 0; i < NUM_CITIZENS; i++) {
        const char *name = first_names[i % 50];

        /* Deterministic role assignment using simple hash */
        seed = seed * 1103515245 + 12345;
        int role_idx = (seed >> 16) % 5;
        const char *role = roles[role_idx];

        /* Age between 18 and 65 */
        seed = seed * 1103515245 + 12345;
        int age = 18 + ((seed >> 16) % 48);

        fprintf(fp, "%s,%s,%d\n", name, role, age);
    }

    fclose(fp);

    printf("Generated %s with %d citizens.\n", output_file, NUM_CITIZENS);

    /* Print a preview */
    fp = fopen(output_file, "r");
    if (fp) {
        char line[256];
        printf("\nPreview (first 10 entries):\n");
        for (int i = 0; i < 10 && fgets(line, sizeof(line), fp); i++) {
            printf("  %s", line);
        }
        fclose(fp);
    }

    return 0;
}
