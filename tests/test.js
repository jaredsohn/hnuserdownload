var hnuser = require("../lib/hnuser.js");
hnuser.hnuser("jaredsohn", function(results)
{
	if (results.hits.length > 0)
		console.log("passed");
});