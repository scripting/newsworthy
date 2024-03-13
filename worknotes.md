#### 3/8/24; 9:01:22 AM by DW

Yesterday's attempt to get tab clicking to work reliably didn't work, now trying another approach. 

ChatGPT says we should look for pointerdown instead of click events, because these include finger clicks. 

If it works, I'll post a link to its opinion here.

#### 3/7/24; 10:56:03 AM by DW

Tab clicks not working -- might have a fix.

https://github.com/scripting/Scripting-News/issues/287#issuecomment-1983757115

Look in buildTabsAsTabs.

#### 3/6/24; 10:37:55 AM by DW

Added blogroll code. 

#### 3/1/24; 10:58:24 AM by DW

Switched urlFeedListOpml over to the blogroll category in my account on feedland.social.

https://feedland.social/opml?screenname=davewiner&catname=blogroll

#### 2/27/24; 12:10:52 PM by DW

Add a blogroll to the scripting news home page. 

The index.html file here is the one used to render the actual scripting.com home page.

So when we're working on a prototype, you should make a copy of index.html, call it test.html, and iterate over that.

When you want to deploy the new version, change it to index.html.

#### 2/13/24; 4:33:38 PM by DW

The All category is very slow, working on it, in the meantime the News tab should be displaying something faster, like Tech category. 

#### 11/30/23; 11:06:20 AM by DW

This is the template for the new Scripting News home page. The story pages are still handled by the old template.

This is a total rewrite, things had gotten out of hand in the old codebase, five years of add-ons and experiments, most of which worked.

You can edit this. When you save the project a test version is saved at:

http://scripting.com/tmp/newsworthy/

To switch to this home page template, all you need to do is edit oldSchoolConfig, and change

"urlHomePageTemplate": "http://scripting.com/code/newsworthy/index.html",

#### 11/26/23; 10:14:52 AM by DW

I have to put the tabs across the top, not on the side. There are places where we don't have *any* spare real estate horizontally, such as tablets and phones. 

I could use a menu in the menubar, but i want you to *see* the tabs on the screen, not to have to go looking for them. big difference. 

#### 11/22/23; 10:54:32 AM by DW

To get a wordpress blog id, try this (for doc's blog)

https://public-api.wordpress.com/rest/v1.1/sites/doc.searls.com

#### 11/18/23; 9:54:12 AM by DW

Starting. A new shell for my blog. 

Tabs can be rivers or wordpress sites or my blog or other things.

