const { Client } = require('pg');
const { createTransport } = require('nodemailer'); // Import nodemailer
const cron = require('node-cron');
import { databaseConfig } from '../config/database.config';


const dbConfig = databaseConfig;

const emailTransporter = createTransport({
    service: 'gmail',
    auth: {
        user: 'wilianjuniordemellolopes@gmail.com',
        pass: 'Milt091547@',
    },
});

async function sendEmailsForDueTasks() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the day

    const client = new Client(dbConfig);

    try {
        await client.connect();

        const query = `
            SELECT c.*, u.email
            FROM cards c
            JOIN users u ON c.id_create_by = u.id
            WHERE c.previsao::date = $1;
    `;

        const values = [currentDate];

        const result = await client.query(query, values);

        for (const row of result.rows) {
            const userEmail = row.email;
            const subject = 'Lembrete de Tarefa';
            const content = `A tarefa "${row.name}" está agendada para hoje. Certifique-se de completá-la a tempo.`;

            const emailOptions = {
                from: 'wilianjuniordemellolopes@gmail.com',
                to: userEmail,
                subject,
                text: content,
            };

            try {
                await emailTransporter.sendMail(emailOptions);
                console.log(`Email sent to ${userEmail} with subject "${subject}"`);
            } catch (error) {
                console.error(`Failed to send email to ${userEmail}:`, error);
            }
        }
    } catch (error) {
        console.error('Error sending email notifications:', error);
    } finally {
        await client.end();
    }
}

// Agendar a tarefa para executar a cada minuto
cron.schedule('*/1 * * * *', () => {
    sendEmailsForDueTasks();
    console.log('Email enviado.');
});


