#!/bin/bash
# Setup level-specific files and data on the student's environment

STUDENT_HOME=/home/student

# === Act 1 Level Files ===

# Level 1-2: Hidden welcome note
echo "Welcome to PerfQuest! Your secret code is: PERF2024" > $STUDENT_HOME/.welcome_note

# Level 1-3: Kingdom registry
cat > $STUDENT_HOME/kingdom_registry.txt << 'REGISTRY'
Alon,knight,25
Shira,mage,30
Yael,farmer,22
Oren,knight,28
Noa,healer,35
Eitan,merchant,40
Tamar,mage,27
Gil,farmer,19
Dina,knight,31
Roni,merchant,45
Amit,knight,23
Liora,mage,50
Boaz,farmer,20
Michal,healer,38
Avi,knight,26
Tali,mage,29
Ido,farmer,21
Neta,merchant,33
Omri,knight,34
Yarden,healer,42
Dan,knight,27
Sivan,mage,24
Rotem,farmer,18
Gal,merchant,37
Hadas,knight,32
Yuval,mage,41
Keren,farmer,23
Ziv,knight,29
Ayelet,healer,36
Nadav,merchant,44
Shachar,knight,30
Maya,mage,26
Itai,farmer,25
Lior,knight,28
Hila,mage,33
Doron,farmer,20
Shai,merchant,39
Efrat,knight,22
Tom,healer,31
Ran,knight,35
Alma,mage,28
Ori,farmer,24
Dana,merchant,43
Ben,knight,27
Noga,mage,32
Adam,farmer,19
Roni,knight,36
Matan,healer,40
Lee,merchant,34
Chen,mage,29
REGISTRY

# Level 1-5 Boss: Create log files
mkdir -p /var/log/kingdom/north /var/log/kingdom/south /var/log/kingdom/east
cat > /var/log/kingdom/north/server.log << 'LOG'
2024-01-15 10:00:01 INFO Server started
2024-01-15 10:00:05 ERROR ConnectionTimeout: database unreachable
2024-01-15 10:00:10 INFO Retrying connection
2024-01-15 10:00:15 ERROR ConnectionTimeout: database unreachable
2024-01-15 10:00:20 INFO Connection established
2024-01-15 10:01:00 ERROR MemoryOverflow: heap allocation failed
2024-01-15 10:01:05 WARN High memory usage detected
2024-01-15 10:02:00 ERROR DiskFull: cannot write to /tmp
2024-01-15 10:02:01 ERROR DiskFull: cannot write to /var/log
2024-01-15 10:03:00 INFO Cleanup completed
LOG

cat > /var/log/kingdom/south/app.log << 'LOG'
2024-01-15 10:00:01 INFO Application started
2024-01-15 10:00:30 ERROR AuthFailure: invalid token
2024-01-15 10:01:00 ERROR AuthFailure: expired token
2024-01-15 10:01:30 ERROR AuthFailure: invalid token
2024-01-15 10:02:00 WARN Rate limit approaching
2024-01-15 10:02:30 ERROR ConnectionTimeout: API gateway timeout
2024-01-15 10:03:00 INFO Recovery complete
LOG

cat > /var/log/kingdom/east/worker.log << 'LOG'
2024-01-15 10:00:01 INFO Worker started
2024-01-15 10:00:10 ERROR TaskFailed: invalid input format
2024-01-15 10:00:20 ERROR MemoryOverflow: buffer too small
2024-01-15 10:00:30 INFO Task retried successfully
2024-01-15 10:01:00 ERROR ConnectionTimeout: redis unreachable
2024-01-15 10:01:30 WARN Queue depth high
2024-01-15 10:02:00 ERROR TaskFailed: timeout exceeded
2024-01-15 10:02:30 INFO Worker recovered
LOG

# === Act 2 Level Files ===

# Level 2-6: Create a big file for strace demo
dd if=/dev/urandom of=$STUDENT_HOME/big_file.txt bs=1M count=10 2>/dev/null

# Level 2-7: Source file for compilation exercise
cat > $STUDENT_HOME/src/calc.c << 'CALC'
#include <stdio.h>
#include <math.h>

double compute_square(double x) {
    return x * x;
}

double compute_sqrt(double x) {
    return sqrt(x);
}

double compute_sum(int n) {
    double sum = 0;
    for (int i = 0; i < n; i++) {
        sum += compute_square(i) + compute_sqrt(i);
    }
    return sum;
}

int main() {
    double result = compute_sum(10000000);
    printf("Result: %f\n", result);
    return 0;
}
CALC

# Set permissions
chmod -R 755 $STUDENT_HOME/bin/ 2>/dev/null || true
chmod 644 $STUDENT_HOME/kingdom_registry.txt
chmod 644 $STUDENT_HOME/.welcome_note
chmod -R 755 /var/log/kingdom/

echo "Level setup complete!"
