
// The exported functions in this module makes a call to Microsoft Cognitive Service Computer Vision API and return caption
// description if found. Note: you can do more advanced functionalities like checking
// the confidence score of the caption. For more info checkout the API documentation:
// https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/AnalyzeImage

const request = require('request').defaults({ encoding: null });

const VISION_URL_FACES = "https://api.projectoxford.ai/vision/v1.0/analyze/?visualFeatures=Faces&form=BCSIMG&subscription-key=" + "TODO: add your key";
const VISION_URL_DESCRIPTION = "https://api.projectoxford.ai/vision/v1.0/analyze/?visualFeatures=Description&form=BCSIMG&subscription-key=" + "TODO: add your key";
const EMOTION = "https://api.projectoxford.ai/emotion/v1.0/recognize/?form=BCSIMG&subscription-key=" + "TODO: add your key";   

/** 
 *  Gets the caption of the image from an image stream
 * @param {stream} stream The stream to an image.
 * @return (Promise) Promise with caption string if succeeded, error otherwise
 */
exports.getFacesFromStream = stream => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: VISION_URL_FACES,
                encoding: 'binary',
                headers: { 'content-type': 'application/octet-stream' }
            };

            stream.pipe(request.post(requestData, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(extractFaces(JSON.parse(body)));
                }
            }));
        }
    );
}


/// EMOTION
exports.getEMOTIONSFromStream = stream => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: EMOTION,
                encoding: 'binary',
                headers: { 'content-type': 'application/octet-stream' }
            };

            stream.pipe(request.post(requestData, (error, response, body) => {
                if (error) {
                    console.log("@ export EMOTIONS" + error);
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                    console.log("@ ELSE IF");
                }
                else {
                    resolve(extractEMOTIONS(JSON.parse(body)));
                    console.log("@ ELSE ");
                }
            }));
        }
    );
}

// EMOTIONS from URI
exports.getEMOTIONSFromUrl = url => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: EMOTION,
                json: { "url": url } 
            };

            request.post(requestData, (error, response, body) => {
                if (error) {
                    console.log('sridhar, plain error' + error);
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    console.log('Sridhar: Error status code !=200' + response.statusCode);
                    reject(body);
                }
                else {
                    resolve(body);
                }
            });
        }
    );
}


/** 
 *  Gets the caption of the image from an image stream
 * @param {stream} stream The stream to an image.
 * @return (Promise) Promise with caption string if succeeded, error otherwise
 */
exports.getCaptionFromStream = stream => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: VISION_URL_DESCRIPTION,
                encoding: 'binary',
                headers: { 'content-type': 'application/octet-stream' }
            };

            stream.pipe(request.post(requestData, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(JSON.parse(body)));
                }
            }));
        }
    );
}



/** 
 * Gets the caption of the image from an image URL
 * @param {string} url The URL to an image.
 * @return (Promise) Promise with caption string if succeeded, error otherwise
 */
exports.getCaptionFromUrl = url => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: VISION_URL,
                json: { "url": url }
            };

            request.post(requestData, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(body));
                }
            });
        }
    );
}

/**
 * Extracts the caption description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
const extractCaption = body => {
    if (body && body.description && body.description.captions && body.description.captions.length) {
        return body.description.captions[0].text
    }

    return null;
}


/**
 * Extracts the caption description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
const extractFaces = body => {
    if (body && body.faces &&  body.faces.length) {
        return body.faces
    }
    

    return null;
}

///// Extract EMOTIONS
const extractEMOTIONS = body => {
    if (body && body.scores) {
        return body.scores
    }

    return null;
}
