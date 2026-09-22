package com.wejoinlife.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.function.Supplier;

/**
 * Common Thread Pool Manager component.
 * Provides simple asynchronous execution utilities and direct access to the shared executor.
 */
@Component
@RequiredArgsConstructor
public class ThreadPoolManager {

    private final ThreadPoolTaskExecutor applicationTaskExecutor;
    private final ExecutorService commonExecutor;

    /**
     * Executes a fire-and-forget task asynchronously.
     */
    public void execute(Runnable task) {
        commonExecutor.execute(task);
    }

    /**
     * Runs a Runnable asynchronously and returns a CompletableFuture<Void>.
     */
    public CompletableFuture<Void> runAsync(Runnable task) {
        return CompletableFuture.runAsync(task, commonExecutor);
    }

    /**
     * Runs a task returning a value asynchronously via CompletableFuture.
     */
    public <T> CompletableFuture<T> supplyAsync(Supplier<T> task) {
        return CompletableFuture.supplyAsync(task, commonExecutor);
    }

    /**
     * Submits a Supplier task returning a CompletableFuture.
     */
    public <T> CompletableFuture<T> submit(Supplier<T> task) {
        return CompletableFuture.supplyAsync(task, commonExecutor);
    }

    /**
     * Submits a standard Callable task returning a Future.
     */
    public <T> Future<T> submit(Callable<T> task) {
        return commonExecutor.submit(task);
    }

    /**
     * Direct access to the underlying ExecutorService.
     */
    public ExecutorService getExecutorService() {
        return commonExecutor;
    }

    public int getActiveCount() {
        return applicationTaskExecutor.getActiveCount();
    }

    public int getPoolSize() {
        return applicationTaskExecutor.getPoolSize();
    }

    public int getQueueSize() {
        return applicationTaskExecutor.getQueueSize();
    }
}
