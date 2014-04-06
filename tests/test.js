var hnuserdownload = require("../lib/hnuserdownload.js");
hnuserdownload.hnuserdownload("jaredsohn", function(results)
{
	if (results.hits.length > 0)
		console.log("passed");
});