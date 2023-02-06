const http = require("http");
const fs = require("fs");
const wchtoolsAPI = require("wchtools-api");
const login = require("wchtools-api/lib/loginREST").instance;
const url = require("url");
//Create a http server
/**
 * use /help?username=aviraj.ramhith@hangarww.com&password=Keshav@2021&env=a590dc33-59b3-4b9b-b542-612ac16a7b39 url
 * change parameter to correct user
 */
http
  .createServer(function (req, res) {
    //get the query string from the request url
    let query = req.url.split("?") ? req.url.split("?")[1] : "";
    //get the url string from the request url
    let url = req.url.split("?") ? req.url.split("?")[0] : req.url;
    //check if the user is looking for the help url path
    if (url == "/help") {
      let current_url = new URL("http://test.com/?" + query);
      let search_params = current_url.searchParams;
      if (
        search_params.has("username") &&
        search_params.has("password") &&
        search_params.has("env")
      ) {

        //write a response to send to the client
        let contextOptions = {
          //context url options not working
          urls: [
            "https://content-eu-1.content-cms.com/api/"+search_params.get("env")
          ],
        };

        let x = new wchtoolsAPI(contextOptions);
        let context = x.getContext();

        /**
         * define apiOptions object to send to handlelogin function
         * contains username and password
         */
        let apiOptions = {
          username: search_params.get("username"),
          password: search_params.get("password"),
        };

        /**
         * change environment by changing x-ibm-dx-tenant-base-url in the context
         */
        context["x-ibm-dx-tenant-base-url"] =
          "https://content-eu-1.content-cms.com/api/"+search_params.get("env");
        handleLogin(context, apiOptions)
          .then(function (opts) {
            opts["force-override"] = true;
            x.pushModifiedItems(opts);
            return opts;
          })
          .catch(function (err) {
            // console.log(err)
          });
      } else {
        console.log("missing parameters for content push");
      }

      res.end();
    } else {
      //redirect all other url paths to the help path
      res.writeHead(302, { Location: "/help" });
      res.end();
    }
  })
  .listen(6661, function () {
    //listen on port 6661
    console.log("server start at port 6661");
  });

//create a function that takes a file path
function readFile(filePath) {
  return new Promise(function (resolve, reject) {
    //perform the readFile function in the fs node module
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        //reject any errors found
        reject(err);
      } else {
        //parse the file output into JSON
        data = JSON.parse(data);
        //send the data back as promise
        resolve(data);
      }
    });
  });
}
async function handleLogin(context, apiOptions) {
  return login.login(context, apiOptions).then(function (loginResult) {
    return loginResult;
  });
}
