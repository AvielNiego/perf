FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install core tools
RUN apt-get update && apt-get install -y \
    linux-tools-generic \
    linux-tools-common \
    strace \
    ltrace \
    gcc \
    g++ \
    make \
    gdb \
    binutils \
    git \
    curl \
    procps \
    htop \
    openssh-server \
    sudo \
    man-db \
    less \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Create student user
RUN useradd -m -s /bin/bash student && \
    echo "student:perfquest" | chpasswd && \
    usermod -aG sudo student && \
    echo "student ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Create directory structure
RUN mkdir -p /home/student/bin \
             /home/student/src \
             /home/student/tools

# Clone FlameGraph tools
RUN git clone --depth 1 https://github.com/brendangregg/FlameGraph.git /home/student/tools/FlameGraph

# Copy and compile demo programs
COPY demo-programs/src/ /home/student/src/
COPY demo-programs/Makefile /home/student/src/Makefile
COPY setup-levels.sh /opt/setup-levels.sh
RUN chmod +x /opt/setup-levels.sh

WORKDIR /home/student/src
RUN make all || true

# Copy binaries to /home/student/bin
RUN cp -f /home/student/src/*.bin /home/student/bin/ 2>/dev/null || true

# Setup SSH
RUN mkdir /var/run/sshd && \
    sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -i 's/#PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Create level data files
RUN /opt/setup-levels.sh

# Fix ownership
RUN chown -R student:student /home/student

USER student
WORKDIR /home/student

EXPOSE 22

CMD ["sudo", "/usr/sbin/sshd", "-D"]
