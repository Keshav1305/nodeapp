function formatErrorResponse(error) {
    const errorInJson = JSON.stringify(error);
    // console.log(errorInJson);
    const errorJsonArray = JSON.parse(errorInJson);
    
    if (Array.isArray(error)) {
    const logMessages = errorJsonArray.map(obj => {
      const log = obj.log;
      const heading = obj.heading;
    //   ... Perform the message extraction logic here
    //   ... Extract unique messages, IDs, names, and content details
    //   ... Create the log message object
    //   Create a regular expression pattern to match the messages
      const messagePattern = /"message"\s*:\s*"([^"]+)"/g
      const idPattern = /"id"\s*:\s*"([^"]+)"/g
      const namePattern = /"name"\s*:\s*"([^"]+)"/g

      // Extract all the messages using the match method
      const messages = log.match(messagePattern);
      // Iterate over the matched messages and extract the content between the quotes
      const extractedMessages = messages.map(message => message.substring('"message":"'.length, message.length - 1));

      const uniqueMessages = [...new Set(extractedMessages)];

      // Extract all the ids using the match method
      const idMessages = log.match(idPattern);
      // Iterate over the matched ids and extract the content between the quotes
      const idExtractedMessages = idMessages.map(id => id.substring('"id":"'.length, id.length - 1));

      const idUniqueMessages = [...new Set(idExtractedMessages)];

      // Extract all the names using the match method
      const nameMessages = log.match(namePattern);
      // Iterate over the matched names and extract the content between the quotes
      const nameExtractedMessages = nameMessages.map(name => name.substring('"name":"'.length, name.length - 1));

      const nameUniqueMessages = [...new Set(nameExtractedMessages)];

      // Extract all the content names and ids using the match method in the heading object
      let headingMatch;
      const results = [];
      const headingRegex = /"id"\s*:\s*"([^"]+)"[\s\S]*?"name"\s*:\s*"([^"]+)"/g;

      while ((headingMatch = headingRegex.exec(heading)) !== null  ) {
          const itemId = headingMatch[1];
          const itemName = headingMatch[2]; 
          results.push({itemId, itemName });
        }
  
      return {
        "Error Messages": uniqueMessages,
        "IDs": idUniqueMessages,
        "Names": nameUniqueMessages,
        "Content Details": results
      };
    });
  
    const response = {
      statusCode: 500,
      contentType: "application/json",
      body: {
        error: "Push via node error",
        logMessages: logMessages
      }
    };
    return response;
}
else {
    let errorMessage = [];
    errorMessage.push(errorInJson);

    const messagePattern = /"message"\s*:\s*"([^"]+)"/g
    // Extract all the messages using the match method
    const messages = errorInJson.match(messagePattern);
    // Iterate over the matched messages and extract the content between the quotes
    const extractedMessages = messages.map(message => message.substring('"message":"'.length, message.length - 1));

    const uniqueMessages = [...new Set(extractedMessages)];
    
    const response = {
        statusCode: 500,
        contentType: "application/json",
        body: {
          error: "Push via node error",
          errorLogMessages: uniqueMessages
        }
      };
      console.log("message: ", uniqueMessages)
      return response;
  }
}
  
  module.exports = { formatErrorResponse };
  