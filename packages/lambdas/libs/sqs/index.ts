//TODO

export interface SQSMessageData {
  token?: string;
  applicationId?: string;
}

export const parseSQSRecord = (record: { body: string }): SQSMessageData => {
  try {
    return JSON.parse(record.body);
  } catch (error) {
    console.error("Error parsing SQS record:", error);
    throw error;
  }
};

export const isSlashCommandMessage = (message: SQSMessageData): boolean => {
  return !!(message.token && message.applicationId);
};

export const isChannelMessage = (message: SQSMessageData): boolean => {
  return !isSlashCommandMessage(message);
};
