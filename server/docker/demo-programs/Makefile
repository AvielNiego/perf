CC = gcc
CFLAGS = -g -O2 -Wall
CFLAGS_NODEBUG = -O2 -Wall -s
LDFLAGS = -lpthread -lm

PROGRAMS = counter slow_calc cache_friendly cache_unfriendly \
           thread_demo mem_speed switch_demo deep_calls \
           multi_path mystery_slow complex_app matrix_multiply \
           false_sharing_demo io_heavy_app calc_debug calc_nodebug \
           workload_mix data_processor latency_app kingdom_registry_gen

BINDIR = /home/student/bin

all: $(PROGRAMS)

counter: counter.c
	$(CC) $(CFLAGS) -o $(BINDIR)/counter $< $(LDFLAGS)

slow_calc: slow_calc.c
	$(CC) $(CFLAGS) -o $(BINDIR)/slow_calc $< $(LDFLAGS)

cache_friendly: cache_friendly.c
	$(CC) $(CFLAGS) -o $(BINDIR)/cache_friendly $< $(LDFLAGS)

cache_unfriendly: cache_unfriendly.c
	$(CC) $(CFLAGS) -o $(BINDIR)/cache_unfriendly $< $(LDFLAGS)

thread_demo: thread_demo.c
	$(CC) $(CFLAGS) -o $(BINDIR)/thread_demo $< $(LDFLAGS)

mem_speed: mem_speed.c
	$(CC) $(CFLAGS) -o $(BINDIR)/mem_speed $< $(LDFLAGS)

switch_demo: switch_demo.c
	$(CC) $(CFLAGS) -o $(BINDIR)/switch_demo $< $(LDFLAGS)

deep_calls: deep_calls.c
	$(CC) $(CFLAGS) -o $(BINDIR)/deep_calls $< $(LDFLAGS)

multi_path: multi_path.c
	$(CC) $(CFLAGS) -o $(BINDIR)/multi_path $< $(LDFLAGS)

mystery_slow: mystery_slow.c
	$(CC) $(CFLAGS) -o $(BINDIR)/mystery_slow $< $(LDFLAGS)

complex_app: complex_app.c
	$(CC) $(CFLAGS) -o $(BINDIR)/complex_app $< $(LDFLAGS)

matrix_multiply: matrix_multiply.c
	$(CC) $(CFLAGS) -o $(BINDIR)/matrix_multiply $< $(LDFLAGS)

false_sharing_demo: false_sharing_demo.c
	$(CC) $(CFLAGS) -o $(BINDIR)/false_sharing_demo $< $(LDFLAGS)

io_heavy_app: io_heavy_app.c
	$(CC) $(CFLAGS) -o $(BINDIR)/io_heavy_app $< $(LDFLAGS)

calc_debug: calc.c
	$(CC) $(CFLAGS) -o $(BINDIR)/calc_debug $< -lm

calc_nodebug: calc.c
	$(CC) $(CFLAGS_NODEBUG) -o $(BINDIR)/calc_nodebug $< -lm

workload_mix: workload_mix.c
	$(CC) $(CFLAGS) -o $(BINDIR)/workload_mix $< $(LDFLAGS)

data_processor: data_processor.c
	$(CC) $(CFLAGS) -o $(BINDIR)/data_processor $< $(LDFLAGS)

latency_app: latency_app.c
	$(CC) $(CFLAGS) -o $(BINDIR)/latency_app $< $(LDFLAGS)

kingdom_registry_gen: kingdom_registry_gen.c
	$(CC) $(CFLAGS) -o $(BINDIR)/kingdom_registry_gen $<

clean:
	rm -f $(BINDIR)/*

.PHONY: all clean
