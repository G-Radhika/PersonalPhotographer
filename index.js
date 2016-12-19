'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var http = require("http");
var pngjs = require("pngjs");
var v4l2camera = require("v4l2camera");

var gcloud = require('google-cloud');
var storage = gcloud.storage;
var storage = require('@google-cloud/storage');
var fs = require("fs");

// Authenticating on a per-API-basis. You don't need to do this if you auth on a
// global basis (see Authentication section above).

var gcs = storage({
  projectId: 'personal-photographer',
  keyFilename: './personal-photographer-833f66686fbd.json'
});

// Reference an existing bucket.
var bucket = gcs.bucket('photoassist-bucket');



const restService = express();
restService.use(bodyParser.json());

restService.post('/', function (req, res) {

    console.log('webhook request from API.AI');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action === 'TakePicture') {
                    var png = toPng();
                    png.pack().pipe(fs.createWriteStream('result.png'));
		    speech = 'Sridhar Picture Taken';
                    console.log('picture saved');
                    // Upload a local file to a new file to be created in your bucket.
                    bucket.upload('result.png', function(err, file) {
                        if (!err) {
                             console.log("result.png is now in your bucket.");
                            }else {
                                console.log("Error uploading to  bucket." + err);
                            }
                    });

                    // Download a file from your bucket.
                    bucket.file('giraffe.jpg').download({
                        destination: '/resultGCS.png'
                    }, function(err) {});
		    
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.get('/', function(req, res){
  console.log('http get request from browser');
   try {
        
     if (req.url === "/") {
        res.writeHead(200, {
            "content-type": "text/html;charset=utf-8",
        });
        res.end([
            "<!doctype html>",
            "<html><head><meta charset='utf-8'/>",
            "<script>(", script.toString(), ")()</script>",
            "</head><body>",
            "<img id='cam' width='352' height='288' />",
            "</body></html>",
        ].join(""));
        return;
    }
    
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

// For all other requests
restService.use(function(req, res, next){
        
    if (req.url.match(/^\/.+\.png$/)) {
        res.writeHead(200, {
            "content-type": "image/png",
            "cache-control": "no-cache",
        });
        var png = toPng();
        return png.pack().pipe(res);
    }
   
    next();
});


restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});

var script = function () {
    window.addEventListener("load", function (ev) {
        var cam = document.getElementById("cam");
        (function load() {
            var img = new Image();
            img.addEventListener("load", function loaded(ev) {
                cam.parentNode.replaceChild(img, cam);
                img.id = "cam";
                cam = img;
                load();
            }, false);
            img.src = "/" + Date.now() + ".png";
	    console.log("In script: " + img.src);
        })();
    }, false);
};

var toPng = function () {
    var rgb = cam.toRGB();
    var png = new pngjs.PNG({
        width: cam.width, height: cam.height,
        deflateLevel: 1, deflateStrategy: 1,
    });
    var size = cam.width * cam.height;
    for (var i = 0; i < size; i++) {
        png.data[i * 4 + 0] = rgb[i * 3 + 0];
        png.data[i * 4 + 1] = rgb[i * 3 + 1];
        png.data[i * 4 + 2] = rgb[i * 3 + 2];
        png.data[i * 4 + 3] = 255;
    }
    return png;
};

var cam = new v4l2camera.Camera("/dev/video0")
if (cam.configGet().formatName !== "YUYV") {
    console.log("YUYV camera required");
    process.exit(1);
}
cam.configSet({width: 352, height: 288});
cam.start();
cam.capture(function loop() {
    cam.capture(loop);
});
