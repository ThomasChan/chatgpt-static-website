// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');

const { db } = aircode;
const ChatTable = db.table('chat');

module.exports = async function (params, context) {
  try {

    // Note: do your authenticate here

    const records = await ChatTable.where().sort({ createdAt: 1 }).find();
    context.status(200);
    return records;
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
