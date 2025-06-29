package br.edu.utfpr.api1.configs;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${RABBITMQ_URI}")
    private String rabbitUri;

    public static final String QUEUE_NAME = "orchard-events";

    @Bean
    public ConnectionFactory rabbitConnectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setUri(rabbitUri);
        return factory;
    }

    @Bean
    public Queue orchardQueue() {
        return new Queue(QUEUE_NAME, true);
    }
}
