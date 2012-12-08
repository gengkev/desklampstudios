// folder id: 0B4pKCnO2NaBvejc5eGJDMGV0SVE
var https = require('https'),
    fs = require('fs'),
    md = require('node-markdown').Markdown;

var destination = process.argv[2];
console.log("saving location: " + destination);

const API_KEY = "AIzaSyDBqsptgXpewQnSy3cf1MRPyoaA7dwS5sE";
//const FOLDER = "0B4pKCnO2NaBvejc5eGJDMGV0SVE";
const FOLDER = "0B4pKCnO2NaBvYnQ4a3g3ZmZjZWc";

https.request("https://www.googleapis.com/drive/v2/files?q='" + FOLDER + "'+in+parents&key=" + API_KEY, function(res) {
	res.setEncoding("utf8");
	var data = '';
	res.on('data', function(chunk) {
		data += chunk;
	});
	res.on('end', function() {
		//console.log(data);
		var json = JSON.parse(data);
		json.items.forEach(function(item) {
			console.log(item.title);
			if (item.labels.trashed) {
				console.log("skip");
				return;
			}
			/*
			var exportLink = item.exportLinks["text/plain"];
			https.get(exportLink, function(res2) {
				var data2 = '';
				res2.on('data', function(chunk) {
					data2 += chunk;
				});
				res2.on('end', function() {
					var html = md(data2);
					fs.writeFile(item.title + '.html', html);
				});
			});
			*/
			var exportLink = item.exportLinks["text/html"];
			https.get(exportLink, function(res2) {
				var data2 = '';
				res2.on('data', function(chunk) {
					data2 += chunk;
				});
				res2.on('end', function() {
					var filename = item.title.replace(/\s/g, "-") + ".html";
					var frontMatter =
						"---\n" +
						"layout: post\n" +
						"title: " + item.title + "\n" +
						"permalink: " + "/studyguides/" + filename + "\n" +
						"---\n";
					fs.writeFileSync(destination + filename, frontMatter + data2);
					console.log("saved");
				});
			});
		});
	});
}).on("error", function(e) {
	console.log("Error! "+e.message);
}).end();