const http = require("http");
const url = require("url");
const { handlePullAssets, handlePushModifiedItems } = require("./handlers");
const { formatErrorResponse } = require("./utils");

// Configuration
const config = {
  port: 6661,
  wchAPIBaseUrl: "https://content-eu-1.content-cms.com/api/",
};

// Server
http.createServer(async function (req, res) {
  const endpoint = url.parse(req.url).pathname;

  try {
    if (endpoint === "/pull-assets") {
      // Handle pullAssets endpoint
      await handlePullAssets(req, res, config);
    } else if (endpoint === "/push-items") {
      // Handle pushModifiedItems endpoint
      await handlePushModifiedItems(req, res, config);
    } else {
      // Invalid endpoint
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Invalid endpoint");
    }
  } catch (error) {
    const response = formatErrorResponse(error);
    console.log("catch index:", response);
    // res.writeHead(response.statusCode, { "Content-Type": response.contentType });
    //res.end(JSON.stringify(response.body));

    // Send the error response back to the .NET app
    const errorResponse = JSON.stringify(response.body);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(errorResponse);
  }
}).listen(config.port, function () {
  console.log(`Server started on port ${config.port}`);
});
