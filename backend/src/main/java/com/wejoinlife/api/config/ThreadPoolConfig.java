package com.wejoinlife.api.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * Centralized thread pool and asynchronous execution configuration.
 * Exposes both Spring's ThreadPoolTaskExecutor and standard Java ExecutorService beans
 * with graceful shutdown and bounded task queues.
 */
@Slf4j
@Configuration
@EnableAsync
public class ThreadPoolConfig {

    @Value("${application.async.core-pool-size:10}")
    private int corePoolSize;

    @Value("${application.async.max-pool-size:50}")
    private int maxPoolSize;

    @Value("${application.async.queue-capacity:500}")
    private int queueCapacity;

    @Value("${application.async.keep-alive-seconds:60}")
    private int keepAliveSeconds;

    @Value("${application.async.thread-name-prefix:wjl-async-}")
    private String threadNamePrefix;

    @Value("${application.async.await-termination-seconds:30}")
    private int awaitTerminationSeconds;

    @Primary
    @Bean(name = {"applicationTaskExecutor", "taskExecutor"})
    public ThreadPoolTaskExecutor applicationTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setKeepAliveSeconds(keepAliveSeconds);
        executor.setThreadNamePrefix(threadNamePrefix);

        // Graceful shutdown: Allow in-flight tasks to complete when shutting down
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(awaitTerminationSeconds);

        // Rejection policy: Run in the calling thread if queue is full instead of crashing
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        executor.initialize();
        log.info("Initialized Common ThreadPoolTaskExecutor: core={}, max={}, queue={}, prefix={}",
                corePoolSize, maxPoolSize, queueCapacity, threadNamePrefix);
        return executor;
    }

    /**
     * Exposes standard Java ExecutorService bean for injection anywhere in the application.
     */
    @Bean(name = "commonExecutor")
    public ExecutorService commonExecutor(ThreadPoolTaskExecutor applicationTaskExecutor) {
        return applicationTaskExecutor.getThreadPoolExecutor();
    }
}
