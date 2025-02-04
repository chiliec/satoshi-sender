import axios from 'axios';

interface TelegramMessage {
    chat_id: string | number;
    text: string;
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    disable_notification?: boolean;
}

interface TelegramResponse {
    ok: boolean;
    result?: {
        message_id: number;
        date: number;
        text: string;
    };
    description?: string;
}

export class TelegramBot {
    private readonly baseUrl: string;

    constructor(private readonly botToken: string) {
        this.baseUrl = `https://api.telegram.org/bot${botToken}`;
    }

    async sendMessage(message: TelegramMessage): Promise<TelegramResponse> {
        try {
            const response = await axios.post<TelegramResponse>(
                `${this.baseUrl}/sendMessage`,
                message
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    ok: false,
                    description: error.response?.data?.description || error.message
                };
            }
            return {
                ok: false,
                description: 'Unknown error occurred'
            };
        }
    }
}
