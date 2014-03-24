// TODO: documentation, commandline, remove stdout?; also write another program that makes use of this
// TODO: include request dependency in package.json
// TODO: replace in_use with making this a singleton
// TODO: best way to prevent multiple simultaneous calls? (since only one request at a time is allowed)

var hnuser = function()
{
	var request = require('request'); // change to browser-request if browserifying this
	var _saved_results = {};
	var _in_use = false;
	var _callback = null;

	// Make a call to hnsearch for an author (possibly multiple if paging involved)
	// Return a possibly concatenated list of hits
	//
	// Caller is responsible for not hitting API limit of 1000 calls per hour.  _saved_results.num_requests indicates how many requests were made. (Sleep 3.6 seconds * _saved_results.num_requests if running this in some kind of loop.)
	var _get_author_content = function(author, end_timestamp_i)
	{
		var url = "https://hn.algolia.com/api/v1/search_by_date?tags=author_" + author + "&hitsPerPage=1000&numericFilters=created_at_i%3c" + end_timestamp_i;
		_saved_results.num_requests++;
		request(url, function(error, response, body)
		{
			if (!error && response.statusCode === 200) {
				var jsonified = JSON.parse(response.body);
				_save_results(jsonified.hits);
	        	if (jsonified.nbHits > jsonified.hitsPerPage)
	        	{
	        		_get_author_content(author, jsonified.hits[jsonified.hits.length - 1].created_at_i);
				}
				else
				{
					_in_use = false;

					_callback(_saved_results);
				}
			} else
			{
				throw "hnuser: Could not complete request. Error = " + error + ", statuscode = " + response.statusCode;
			}
		});
	}

	// Use Algolia's hnsearch API; pages through results based on timestamp
	this.get_author_content = function(author, callback)
	{
		if (_in_use)
		{
			throw("hnuser: Only make one request at a time.");
			return;
		}
		_in_use = true;

		_callback = callback;
		_saved_results = {};
		_saved_results.hits = [];
		_saved_results.comment_count = 0;
		_saved_results.story_count = 0;
		_saved_results.comment_karma = 0;
		_saved_results.story_karma = 0;
		_saved_results.num_requests = 0;

		_get_author_content(author, new Date().getTime());
	}

	var _save_results = function(results)
	{
		var found_hit_type = false;

		_saved_results.hits = _saved_results.hits.concat(results);

		for (i = 0; i < results.length; i++)
		{
			for (j = 0; j < results[i]._tags.length; j++)
			{
				if (results[i]._tags[j] === "story")
				{
					results[i].type = "story";
					_saved_results.story_karma += results[i].points - 1;
					_saved_results.story_count++;
					found_hit_type = true;
					break;
				} else if (results[i]._tags[j] === "comment")
				{
					results[i].type = "comment";
					_saved_results.comment_karma += results[i].points - 1;
					_saved_results.comment_count++;
					found_hit_type = true;
					break;
				}
			}
			if (!found_hit_type)
			{
				console.log("unexpected hit type");
				console.log(results[i]);				
			}
		}
	}		
};

exports.hnuser = function(author, callback)
{
	var _hnuser = new hnuser();
	_hnuser.get_author_content(author, callback);
}

// the callback will be passed params filename, csvcontents and be called
exports.hnuser_data_to_csv = function(author, data, callback)
{
	// Note: csv does not include computed stats
	var json2csv = require('json2csv');
	json2csv(
	    {   data: data.hits, 
	        fields: ['created_at', 'points', 'type', 'comment_text', 'story_title', 'url', 'title', 'story_url', 'story_text', 'num_comments', 'created_at_i'],  // TODO
	        fieldNames: ['created_at', 'points', 'type', 'comment_text', 'story_title', 'url', 'title', 'story_url', 'story_text', 'num_comments', 'created_at_i']
	    },
	    function(err, csv) {  
	        if (err)
	        	console.log(err);
	        else
	        {
	        	callback(author + "_data.csv", csv);
			}
	    }
	);
}

// the callback will be passed params filename, csvcontents and be called
exports.hnuser_stats_to_csv = function(author, data, callback)
{
	// Note: csv does not include computed stats
	var json2csv = require('json2csv');

	var stats = {};
	stats.author = author;
	stats.comment_count = data.comment_count;
	stats.story_count = data.story_count;
	stats.comment_karma = data.comment_karma;
	stats.story_karma = data.story_karma;
	stats.num_requests = data.num_requests;

	json2csv(
	    {   data: stats, 
	        fields: ['author', 'comment_karma', 'comment_count', 'story_karma', 'story_count', 'num_requests'],  // TODO
	        fieldNames: ['author', 'comment_karma', 'comment_count', 'story_karma', 'story_count', 'num_requests']
	    },
	    function(err, csv) {  
	        if (err)
	        	console.log(err);
	        else
	        {
	        	callback(author + "_stats.csv", csv);
			}
	    }
	);
}
