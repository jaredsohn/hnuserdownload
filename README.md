# hnuser npm module

# Written by Jared Sohn (jared.sohn@gmail.com)

Specify a username to download all comments/submissions and some statistics (such as separated comment and submission karma)

Uses Algolia's hnsearch API; since it has a limit of 1000 queries per hour, make sure that you check the numrequests output to wait an appropriate time so that you do not get blocked.