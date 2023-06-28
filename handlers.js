const wchtoolsAPI = require("wchtools-api");
const { handleLogin } = require("./auth");
const { formatErrorResponse } = require("./utils");
const url = require("url");

async function handlePullAssets(req, res, config) {
    try {
        // Handle pullAssets endpoint
        const query = url.parse(req.url, true).query;
        const assetId = decodeURIComponent(query.assetId);
        const username = decodeURIComponent(query.username);
        const password = decodeURIComponent(query.password);
        const workingDir = decodeURIComponent(query.dir);
        const sourceEnv = decodeURIComponent(query.env);
    
        const contextOptions = {
          urls: [`${config.wchAPIBaseUrl}${sourceEnv}`],
        };
    
        const wchAPI = new wchtoolsAPI(contextOptions);
        const context = wchAPI.getContext();
    
        context["x-ibm-dx-tenant-base-url"] = `${config.wchAPIBaseUrl}${sourceEnv}`;
    
        const apiOptions = {
          username,
          password,
        };
    
        await handleLogin(context, apiOptions);
    
        const pullResult = await pullAssets(context, assetId, workingDir);
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(pullResult));
      } catch (error) {
        // console.error("Error occurred while handling pullAssets:", error);
        const response = formatErrorResponse(error);
        console.log("catch pull: ", response);
        res.writeHead(response.statusCode, { "Content-Type": response.contentType });
        // res.end(JSON.stringify(response.body));
      }
}

async function handlePushModifiedItems(req, res, config) {
    return new Promise(async (resolve, reject) => {
    try {
        // Handle pushModifiedItems endpoint
        const query = url.parse(req.url, true).query;
        const username = decodeURIComponent(query.username);
        const password = decodeURIComponent(query.password);
        const workingDir = decodeURIComponent(query.dir);
        const targetEnv = decodeURIComponent(query.env);
    
        const contextOptions = {
          urls: [`${config.wchAPIBaseUrl}${targetEnv}`],
        };
    
        const wchAPI = new wchtoolsAPI(contextOptions);
        const context = wchAPI.getContext();
    
        context["x-ibm-dx-tenant-base-url"] = `${config.wchAPIBaseUrl}${targetEnv}`;
    
        const apiOptions = {
          username,
          password,
        };
    
        await handleLogin(context, apiOptions);
    
        const response = await pushModifiedItems(wchAPI, workingDir);
    
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));

        // Resolve with the response
      resolve(response);
      } catch (error) {
        //console.error("Error occurred while handling pushModifiedItems:", error);
        const response = formatErrorResponse(error);
        console.log("catch push: ", response);
        res.writeHead(response.statusCode, { "Content-Type": response.contentType });
        // res.end(JSON.stringify(response.body));

        // Call the reject function with the error
        reject(error);
      }
    });
    }

    async function pullAssets(context, assetId, workingDir) {
        const helper = wchtoolsAPI.getAssetsHelper();
        const pullOptions = {
          "workingDir": workingDir,
        };
        
        const pullResult = await helper.pullItem(context, assetId, pullOptions);
        return pullResult;
    }

    async function pushModifiedItems(wchAPI, workingDir) {
        const opts = {
          "force-override": true,
          "workingDir": workingDir,
        };

        let output = wchAPI.pushModifiedItems(opts);
        return output;
      }
      

module.exports = { handlePullAssets, handlePushModifiedItems };
