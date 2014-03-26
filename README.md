# hnuser

Downloads Hacker News comments/submissions and statistics for a user.  Can be used as a module and from the commandline.

## How to use

Install

```bash
$ npm install hnuser
```

Include the module and run

```javascript
var hnuser = require('hnuser');
    
hnuser(id, function(results) {
  if (err) console.log(err);
  console.log(csv);
});
```

## Features

-- Pages through results to get all comments and stories created by a username.
-- Calculates comment and submission karma
-- Optionally stores data as JSON and CSV

## Limitations

-- Algolia (the source of the data) sets a limit of 1000 requests per hour.  If making heavy use of the API, make sure that you look at the num_requests output to limit usage so that you do not get banned.

## Use as a module

### Example

```javascript
var hnuser = require('hnuser');
hnuser.hnuser("pg", function(results)
{
	console.log(results);
});

There are also methods available to assist creating CSV files.

## Command Line Interface

`hnuser` can also be called from the command line

```bash
Usage: hnuser username [json] [csv]


The username is required. Include json and/or csv to create one or more output files.  The files will be named automatically based on the username.  If you choose csv, separate files will be created for the comments/stories and for the statistics.
      
```

## Other ways to use it

This library has a web frontend at [http://hnuser.herokuapp.com/].  It has a Chrome extension frontend at [http://github.com/jaredsohn/hnkarmabreakdown].


## License

Copyright (C) 2014 [Jared Sohn](mailto: jared.sohn@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
