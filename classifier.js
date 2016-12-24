var watson = require('watson-developer-cloud');
var fs = require('fs');

const restify = require('restify'),
    url = require('url'),
    validUrl = require('valid-url');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3979, () => {
    console.log('%s listening to %s', server.name, server.url);
});

var visual_recognition = watson.visual_recognition({
  headers: {
    "X-Watson-Learning-Opt-Out": "1"
  },
  api_key: 'TODO: add your key here',
  version: 'v3',
  version_date: '2016-05-19'
});
/*
var params = {
	name: 'uyyala_family',
	keerthi_positive_examples: fs.createReadStream('./keerthi.zip'),
  avani_positive_examples: fs.createReadStream('./avani.zip'),
  radhika_positive_examples: fs.createReadStream('./radhika.zip'),
	negative_examples: fs.createReadStream('./notfamily.zip')
};
*/
/*
visual_recognition.deleteClassifier({
  classifier_id: 'uyyala_family_1546270103' },
  function(err, response) {
   if (err)
    console.log(err);
   else
    console.log(JSON.stringify(response, null, 2));
  }
);
*/

/*
visual_recognition.createClassifier(params,
	function(err, response) {
   	 if (err) { 
          console.log('sridhar: createclassifier error' + err);
      		console.log(err);
    	}else {
          console.log('sridhar: response from createclassifier');
   		    console.log(JSON.stringify(response, null, 2));
      }
});
*/
/*
visual_recognition.listClassifiers({},
  function(err, response) {
   if (err)
    console.log(err);
   else
    console.log(JSON.stringify(response, null, 2));
  }
);

visual_recognition.getClassifier({
  classifier_id: 'uyyala_family_331440013' },
  function(err, response) {
   if (err)
    console.log(err);
   else
    console.log(JSON.stringify(response, null, 2));
  }
);
*/

var params = {
  classifier_ids: [
    "uyyala_family_331440013"
  ], 
  images_file: fs.createReadStream('./radhika_test.png'),
  //parameters: 'classify-input.json'
};

visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
});



