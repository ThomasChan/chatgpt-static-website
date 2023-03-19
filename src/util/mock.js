import htmlString from './htmlString';

const mock = [
  {
    question: `how many similar word of 'cheer up', list as table and order by usage frequency`,
    answer: htmlString(`

Similar Words | Usage Frequency
--- | ---
encourage | High
inspire | High
motivate | High
uplift | High
console | Medium
comfort | Medium
reassure | Medium
hearten | Medium
brighten | Low
gladden | Low
elate | Low
enliven | Low`),
  },
  {
    question: 'how to parse ReadableStream response',
    answer: htmlString("\n\nAs an AI language model, I don't have the ability to write code or test it. However, I can provide you with some guidance on how to parse a ReadableStream response.\n\nA ReadableStream is a way to read data in chunks, which can be useful when working with large amounts of data. In order to parse the response from a ReadableStream, you can use the following steps:\n\n1. Create a new instance of the ReadableStream object and fetch the data using the fetch() method.\n\n2. Create a new instance of the TextDecoder object to decode the data from the ReadableStream. \n\n3. Create a new instance of the ReadableStreamDefaultReader object to read the data from the ReadableStream.\n\n4. Use a while loop to read the data from the ReadableStream and append it to a string variable.\n\n5. Once all the data has been read, parse the string variable using JSON.parse() or any other suitable method.\n\nHere is some sample code to help you get started:\n\n```\n// Create a new instance of the ReadableStream object\nconst stream = await fetch('https://example.com/data');\n\n// Create a new instance of the TextDecoder object\nconst decoder = new TextDecoder();\n\n// Create a new instance of the ReadableStreamDefaultReader object\nconst reader = stream.getReader();\n\n// Initialize a string variable to hold the parsed data\nlet data = '';\n\n// Use a while loop to read the data from the ReadableStream and append it to the data variable\nwhile (true) {\n  const { done, value } = await reader.read();\n  if (done) break;\n  data += decoder.decode(value);\n}\n\n// Parse the data using JSON.parse() or any other suitable method\nconst parsedData = JSON.parse(data);\n```\n\nNote that the above code is just an example, and you may need to modify it to suit your specific use case."),
  },
];

export default mock;
