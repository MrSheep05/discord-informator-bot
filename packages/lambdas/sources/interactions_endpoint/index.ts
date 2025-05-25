import { APIGatewayProxyHandler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import * as nacl from "tweetnacl";

const sqsClient = new SQSClient({ region: "eu-central-1" });

//TODO inform user about error
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("RECIEVED EVENT", event);
  try {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const SQS_URL = process.env.SQS_URL;
    if (!PUBLIC_KEY) {
      console.error("PUBLIC_KEY environment variable is not set");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    const signature = event.headers["x-signature-ed25519"];
    const timestamp = event.headers["x-signature-timestamp"];
    const strBody = event.body;

    if (!signature || !timestamp || !strBody) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required headers or body" }),
      };
    }

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + strBody),
      Buffer.from(signature, "hex"),
      Buffer.from(PUBLIC_KEY, "hex")
    );

    if (!isVerified) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid request signature" }),
      };
    }
    const body = JSON.parse(strBody);
    if (body.type === 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 }),
      };
    }

    if (body.type === 2) {
      const { name } = body.data;
      if (name === "test") {
        if (!SQS_URL) {
          console.error("Missing required SQS_URL env");
          return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
          };
        }
        const command = new SendMessageCommand({
          QueueUrl: SQS_URL,
          MessageBody: JSON.stringify({
            token: body.token,
            applicationId: body.application_id,
          }),
        });
        await sqsClient.send(command);
        console.log("Recieved slash command body", body);
        return {
          statusCode: 200,
          body: JSON.stringify({ type: 5, message: "Testing..." }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Request verified successfully" }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
