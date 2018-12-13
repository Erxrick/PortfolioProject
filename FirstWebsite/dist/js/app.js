var fs = require("fs");
var ncp = require("ncp").ncp;
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var exec = require("child_process").exec;

ncp.limit = 30;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.htm");
  console.log("get /");
});

app.get("/payload", function(req, res) {
  res.sendStatus(200);
  console.log("get /payload");
});

app.post("/payload", function(req, res) {
  //verify that the payload is a push from the correct repo

  console.log(
    req.body.pusher.name + " just pushed to " + req.body.repository.name
  );

  console.log("pulling code from GitHub...");

  // reset any changes that have been made locally
  exec("git -C /home/pi/Desktop --hard", execCallback);

  // and ditch any files that have been added locally too
  exec("git -C /home/pi/Desktop clean -df", execCallback);

  // Now pull down the latest
  exec("git -C /home/pi/Desktop pull -f", execCallback);

  // Remove all files from server
  fs.rmdir("/var/www/html", execCallback);
  fs.mkdir("/var/www/html", execCallback);

  var initDir = "/home/pi/Desktop/PortfolioProject/FirstWebsite";
  var files = fs.readdirSync(initDir);
  files.forEach(element => {
    var stat = fs.statSync(dir + "/" + element);
    if (stat && stat.isDirectory()) {
      ncp(initDir, "/var/www/html", execCallback);
    } else if (stat) {
      fs.copyFile(dir + "/" + element, "/var/wwww/html", execCallback);
    }
  });
  // and run tsc
  exec("tsc", execCallback);
});

app.listen(5000, function() {
  console.log("listening on port 5000");
});

function execCallback(err, stdout, stderr) {
  if (stdout) console.log(stdout);
  if (stderr) console.log(stderr);
}
