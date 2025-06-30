package br.edu.utfpr.api1.consumer;

import br.edu.utfpr.api1.configs.RabbitMQConfig;
import br.edu.utfpr.api1.model.Report;
import br.edu.utfpr.api1.repository.ReportRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ReportConsumer {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private RabbitAdmin rabbitAdmin;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveMessage(String message) {
        try {
            Report report = objectMapper.readValue(message, Report.class);
            // reportRepository.save(report); // Removido para não salvar no banco de dados
            System.out.println("Report recebido: " + report.getContent());
            checkQueueStatus();
        } catch (IOException e) {
            System.err.println("Erro ao processar mensagem do RabbitMQ: " + e.getMessage());
        }
    }

    private void checkQueueStatus() {
        Integer messageCount = (Integer) rabbitAdmin.getQueueProperties(RabbitMQConfig.QUEUE_NAME).get("MESSAGE_COUNT");
        if (messageCount != null && messageCount == 0) {
            System.out.println("Fila 'reports_queue' está vazia.");
        } else if (messageCount != null) {
            System.out.println("Fila 'reports_queue' tem " + messageCount + " mensagens.");
        }
    }
}
