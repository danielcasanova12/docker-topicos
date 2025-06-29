package br.edu.utfpr.api1.service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class EventConsumer {

    @RabbitListener(queues = br.edu.utfpr.api1.configs.RabbitMQConfig.QUEUE_NAME)
    public void handleMessage(String message) {
        System.out.println("[RabbitMQ] Mensagem recebida: " + message);
        // Aqui você poderia armazenar no banco ou acionar outra lógica
    }
}
