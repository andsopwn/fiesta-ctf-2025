#define _GNU_SOURCE
#include <dlfcn.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/syscall.h>
#include <sys/uio.h>
#include <stdio.h>
#include <pthread.h>

static ssize_t (*real_write)(int, const void *, size_t);
static ssize_t (*real_writev)(int, const struct iovec *, int);
static ssize_t (*real_send)(int, const void *, size_t, int);
static ssize_t (*real_sendto)(int, const void *, size_t, int, const struct sockaddr *, socklen_t);
static ssize_t (*real_sendmsg)(int, const struct msghdr *, int);
static pthread_mutex_t log_mutex = PTHREAD_MUTEX_INITIALIZER;
static int logging = 0;

static void init_real() {
    if (!real_write) real_write = dlsym(RTLD_NEXT, "write");
    if (!real_writev) real_writev = dlsym(RTLD_NEXT, "writev");
    if (!real_send) real_send = dlsym(RTLD_NEXT, "send");
    if (!real_sendto) real_sendto = dlsym(RTLD_NEXT, "sendto");
    if (!real_sendmsg) real_sendmsg = dlsym(RTLD_NEXT, "sendmsg");
}

static void dump_raw(const void *buf, size_t len) {
    syscall(SYS_write, STDERR_FILENO, buf, len);
}

static void dump_buf(const char *prefix, int fd, const void *buf, size_t len) {
    if (logging) return;
    if (!buf || len == 0) return;
    logging = 1;
    char header[128];
    int header_len = snprintf(header, sizeof(header), "[hook] %s fd=%d len=%zu\n", prefix, fd, len);
    dump_raw(header, header_len);
    dump_raw(buf, len);
    const char footer[] = "\n[hook] ---END---\n";
    dump_raw(footer, sizeof(footer)-1);
    logging = 0;
}

ssize_t write(int fd, const void *buf, size_t count) {
    init_real();
    if (fd >= 0 && count > 0) dump_buf("write", fd, buf, count);
    return real_write(fd, buf, count);
}

ssize_t writev(int fd, const struct iovec *iov, int iovcnt) {
    init_real();
    ssize_t ret = real_writev(fd, iov, iovcnt);
    if (fd >= 0 && iov && iovcnt > 0) {
        for (int i = 0; i < iovcnt; i++) {
            if (iov[i].iov_len > 0) dump_buf("writev", fd, iov[i].iov_base, iov[i].iov_len);
        }
    }
    return ret;
}

ssize_t send(int sockfd, const void *buf, size_t len, int flags) {
    init_real();
    if (sockfd >= 0 && len > 0) dump_buf("send", sockfd, buf, len);
    return real_send(sockfd, buf, len, flags);
}

ssize_t sendto(int sockfd, const void *buf, size_t len, int flags, const struct sockaddr *dest_addr, socklen_t addrlen) {
    init_real();
    if (sockfd >= 0 && len > 0) dump_buf("sendto", sockfd, buf, len);
    return real_sendto(sockfd, buf, len, flags, dest_addr, addrlen);
}

ssize_t sendmsg(int sockfd, const struct msghdr *msg, int flags) {
    init_real();
    if (sockfd >= 0 && msg) {
        for (size_t i = 0; i < msg->msg_iovlen; i++) {
            if (msg->msg_iov[i].iov_len > 0)
                dump_buf("sendmsg", sockfd, msg->msg_iov[i].iov_base, msg->msg_iov[i].iov_len);
        }
    }
    return real_sendmsg(sockfd, msg, flags);
}
