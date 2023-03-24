// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { Configuration, OpenAIApi } = require('openai');
const { v4: uuidv4 } = require('uuid');

const { db } = aircode;
const ChatTable = db.table('chat');

module.exports = async function (params, context) {
  try {
    console.log(params);
    if (typeof params.body !== 'string') {
      context.status(400);
      return 'Bad parameters, invalid body';
    }
    const data = JSON.parse(params.body);

    // Note: do your authenticate here

    if (!data
      || !data.model
      || !data.messages
      || !data.messages.length) {
      context.status(400);
      return 'Bad parameters, invalid body';
    }

    // is question already being asked?
    const record = await ChatTable.where({ question: data.messages[0].content }).findOne();
    if (record) {
      context.set('content-type', 'application/json');
      return {
        usage: record.usage,
        choices: record.choices,
      }
    }

    // Create a chat ID if not provided
    const chatId = uuidv4();
    const openai = new OpenAIApi(new Configuration({ apiKey: process.env.Authorization }));

    // Request completion
    const completion = await openai.createChatCompletion(data);
    console.log(completion);

    // Save generated response to ChatTable
    const newChat = await ChatTable.save({
      chatId,
      question: data.messages[0].content,
      usage: completion.data.usage,
      choices: completion.data.choices,
    });

    context.set('content-type', 'application/json');
    return {
      createdAt: newChat.createdAt,
      usage: completion.data.usage,
      choices: completion.data.choices,
    };
  } catch (error) {
    // Set the response status to 500 (Internal Server Error)
    context.status(500);
    // Log the error
    console.log('error', error.response || error);

    // Initialize an error message variable
    let errorMessage;

    // If there is a response object in the error,
    // it means the request was made and the server responded with an error status
    if (error.response) {
      const { status, statusText, data } = error.response;

      if (status === 401) {
        // If the status code is 401, set a specific error message related to the OpenAI API key
        errorMessage = 'Unauthorized';
      } else if (data.error && data.error.message) {
        // If there is an error message in the data, use it as the error message
        errorMessage = data.error.message;
      } else {
        // Otherwise, use the status code and status text as the error message
        errorMessage = `Request failed with status code ${status}: ${statusText}`;
      }
    } else if (error.request) {
      // If there is a request object in the error,
      // it means the request was made but no response was received
      errorMessage = 'No response received from the server';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // If there is a network error, such as DNS resolution or connection refused
      errorMessage = `Network error: ${error.message}`;
    } else {
      // If none of the above conditions are met,
      // it means there was an error setting up the request
      errorMessage = `Request setup error: ${error.message}`;
    }

    return errorMessage;
  }
}
