importScripts("whammy.js");
var encoder = new Whammy.Video();

self.onmessage = function(e) {
	if (e.data.status == "done") {
		var blob = encoder.compile();
		postMessage({blob: blob});
		
		encoder = new Whammy.Video();
	}
	encoder.add(e.data.dataURI, e.data.time);
};