(function() {
	var fs = require('fs');

	if (process.argv.length < 3)
	{
		console.log("usage: hnuser username [csv] [json]");
		return;
	}

	var write_data = function(filename, contents)
	{
		fs.writeFile(filename, contents, function(err) {
			if(err) {
			    console.log(err);
			} else {
			    console.log("Data written to " + filename + ".");
			}
		});
	}

	var hnuser = require('./hnuser.js');
	var argv = require('minimist')(process.argv.slice(2));

	var author = argv._[0];

	console.log("Getting Hacker News data for user " + author + "...");

	hnuser.hnuser(author, function(results)
	{
		if (argv._.indexOf('csv') !== -1)
		{
			hnuser.hnuser_stats_to_csv(author, results, write_data);
			hnuser.hnuser_data_to_csv(author, results, write_data);
		}
		if (argv._.indexOf('json') !== -1)
		{
	    	write_data(author + ".json", JSON.stringify(results));
		}
		console.log("");
		console.log("Comment karma: " + results.comment_karma);
		console.log("Story karma: " + results.story_karma);
		console.log("Comment count: " + results.comment_count)
		console.log("Story count: " + results.story_count);
		console.log("# requests: " + results.num_requests);
		console.log("");
	});
}).call(this)