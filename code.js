const myProductName = "Newsworthy", myVersion = "0.4.3";  


const theTabs = {
	scriptingNews: {
		enabled: true,
		name: "Dave",
		description: "Scripting News, Dave Winer's blog, continuously updated since 1994.",
		type: "blog",
		icon: "fa fa-book",
		flJavaScriptDomFeatures: true,
		getContent: function (callback) {
			const htmltext = $("#idBodytext").html ();
			if (htmltext === undefined) { //test version
				const url = "http://scripting.com/homepage.html";
				httpRequest (url, undefined, undefined, callback);
				}
			else {
				callback (undefined, htmltext);
				}
			}
		},
	Linkblog: {
		enabled: true,
		name: "Links",
		description: "Links that Dave thought you might find interesting, or wanted to keep a link to for himself.",
		type: "linkblog",
		icon: "fa fa-link",
		getContent: function (callback) {
			const feedUrl = "http://data.feedland.org/feeds/davewiner.xml";
			const url = "http://feeder.scripting.com/returnlinkbloghtml?url=" + encodeURIComponent (feedUrl);
			httpRequest (url, undefined, undefined, function (err, htmltext) {
				if (err) {
					callback (err);
					}
				else {
					htmltext = "<div class=\"divLinkblogContainer\">" + htmltext + "</div>";
					callback (undefined, htmltext);
					}
				});
			}
		},
	all: {
		enabled: true,
		name: "News",
		type: "river",
		description: "News from feeds Dave subscribes to in FeedLand, in the \"Tech\" category.",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Tech"}, callback);
			}
		},
	about: {
		enabled: true,
		name: "About",
		type: "outline",
		description: "Notes about this site, in outline form. Not updated often enough. :-)",
		icon: "fa fa-info-circle",
		urlAboutOpml: "http://scripting.com/publicfolder/scripting/aboutpage.opml", 
		getContent: function (callback) {
			const aboutOutlineTitle = "About Scripting News";
			opml.read (theTabs.about.urlAboutOpml, undefined, function (err, theOutline) {
				if (err) {
					callback (err);
					}
				else {
					const outlineBody = theOutline.opml.body;
					outlineBody.text = aboutOutlineTitle;
					const divAboutOutline = $("<div class=\"divAboutOutline\"></div>");
					const divRenderedOutline = renderOutlineBrowser (outlineBody, false, undefined, undefined, true);
					divAboutOutline.append (divRenderedOutline);
					callback (undefined, divAboutOutline);
					}
				});
			}
		
		},
	blog2: {
		enabled: false,
		name: "Blog2",
		type: "blog",
		icon: "fa fa-wordpress",
		getContent: function (callback) {
			getWordPressSiteText (222485322, callback);
			}
		},
	allNews: {
		enabled: false,
		name: "All news",
		description: "News from all the feeds Dave subscribes to in FeedLand.",
		type: "river",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "All"}, callback);
			}
		},
	politicalNews: {
		enabled: false,
		name: "Political news",
		description: "News from feeds Dave subscribes to in FeedLand, in the \"Politics\" category.",
		type: "river",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Politics"}, callback);
			}
		},
	tech: {
		enabled: false,
		name: "Tech",
		description: "News from feeds Dave subscribes to in FeedLand, in the \"Tech\" category.",
		type: "river",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Tech"}, callback);
			}
		},
	podcasts: {
		enabled: false,
		name: "Podcasts",
		type: "river",
		description: "News from feeds Dave subscribes to in FeedLand, in the \"Podcasts\" category.",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Podcasts"}, callback);
			}
		},
	bloggers: {
		enabled: false,
		name: "Bloggers",
		type: "river",
		description: "News from feeds Dave subscribes to in FeedLand, in the \"Bloggers\" category.",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Bloggers"}, callback);
			}
		},
	dave: {
		enabled: false,
		name: "Dave",
		type: "river",
		icon: "fa fa-newspaper",
		getContent: function (callback) {
			setUpRiver ({screenname: "davewiner", catname: "Dave"}, callback);
			}
		},
	};

const appConsts = {
	flBlogrollEnabled: true, //3/13/24 by DW
	urlFeedlandServer: "https://feedland.social/", //2/28/24 by DW
	urlSocketServer: "wss://feedland.social/",
	urlFeedListOpml: "https://feedland.social/opml?screenname=davewiner&catname=blogroll",
	urlFeedlandViewBlogroll: "https://feedland.social/?username=davewiner&catname=blogroll" //3/13/24 by DW
	}

var globals = {
	};

function htmlLink (url, text) {
	return ("<a href=\"" + url + "\" target=\"_blank\">" + text + "</a>");
	}
function addToolTip (theObject, tipText, placement="right") { //8/24/22 by DW
	$(theObject).attr ("data-container", "body"); //10/23/22 by DW
	$(theObject).attr ("data-toggle", "tooltip");
	$(theObject).attr ("data-placement", placement);
	$(theObject).attr ("title", tipText);
	$(theObject).click (function () { //11/1/22 by DW
		$(theObject).tooltip ("hide");
		});
	return (theObject);
	}
function neuterMarkup (theString) { //11/17/23 by DW
	var temp = document.createElement ("div");
	temp.textContent = theString;
	return (temp.innerHTML);
	}
function equalStrings (s1, s2) {
	return (stringLower (s1) == stringLower (s2));
	}
function getAllUrlParams (searchstring=location.search) { //9/7/22 by DW
	var s = searchstring;
	var allparams = new Object ();
	if (beginsWith (s, "?")) {
		s = stringDelete (s, 1, 1);
		}
	var splits = s.split ("&");
	splits.forEach (function (item) {
		const splits = item.split ("="); //9/10/23 by DW
		const name = splits [0];
		var val = decodeURIComponent (stringDelete (item, 1, name.length + 1));
		val = neuterMarkup (val); //11/17/23 by DW
		allparams [trimWhitespace (name)] = val;
		});
	return (allparams);
	}
function doRedirect (url) {
	location.href = url;
	}
function httpRequest (url, timeout, headers, callback) { 
	timeout = (timeout === undefined) ? 30000 : timeout;
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text", 
		headers,
		timeout
		}) 
	.success (function (data, status) { 
		callback (undefined, data);
		}) 
	.error (function (status) { 
		var message;
		try { //9/18/21 by DW
			message = JSON.parse (status.responseText).message;
			}
		catch (err) {
			message = status.responseText;
			}
		if ((message === undefined) || (message.length == 0)) { //7/22/22 by DW & 8/31/22 by DW
			message = "There was an error communicating with the server.";
			}
		var err = {
			code: status.status,
			message
			};
		callback (err);
		});
	}
function setUpRiver (riverSpec, callback) {
	const divRiverContent = $("<div class=\"divRiverContent\"></div>");
	displayTraditionalRiver (riverSpec, divRiverContent);
	callback (undefined, divRiverContent)
	}
function readOpmlFile (url, outlineTitle, callback) {
	httpRequest (url, undefined, undefined, callback);
	}

//wordpress
	const flUseLocalServer = false;
	
	function getServerAddress () {
		if (flUseLocalServer) {
			return ("http://localhost:1408/");
			}
		else {
			return ("https://wpidentity.scripting.com/");
			}
		}
	function myGetSitePosts (idsite, callback) {
		servercall ("wordpressgetsiteposts", {idsite}, true, callback);
		}
	function getWordPressSiteText (idsite, callback) {
		myGetSitePosts (idsite, function (err, thePosts) {
			if (err) {
				callback (err);
				}
			else {
				var htmltext = "", indentlevel = 0, lastday = new Date (0), flNotFirstArchivePageDay = false;
				function add (s) {
					htmltext += filledString ("\t", indentlevel) + s + "\n";
					}
				thePosts.forEach (function (item) {
					if (!sameDay (lastday, item.whenCreated)) {
						if (flNotFirstArchivePageDay) {
							add ("</div>"); indentlevel--;
							}
						add ("<div class=\"divArchivePageDay\">"); indentlevel++;
						flNotFirstArchivePageDay = true;
						
						add ("<div class=\"divDayTitle\">" + formatDate (item.whenCreated, "%A, %B %e, %Y") + "</div>");
						lastday = item.whenCreated;
						}
					add ("<div class=\"divTitledItem\">"); indentlevel++;
					add ("<div class=\"divTitle\">" + item.title + "</div>");
					add ("<div class=\"divWordpressContent\">" + item.content + "</div>");
					add ("</div>"); indentlevel--;
					});
				if (flNotFirstArchivePageDay) {
					add ("</div>"); indentlevel--;
					}
				callback (undefined, htmltext);
				}
			});
		}
	
//tabs
	function getNthTab (n) {
		var ix = 0;
		for (var x in theTabs) {
			if (ix == n) {
				return (theTabs [x]);
				}
			ix++;
			}
		}
	function buildTabsAsTabs (userOptions) {
		var options = {
			nameActiveTab: getNthTab (0).name
			};
		for (var x in userOptions) {
			if (userOptions [x] !== undefined) {
				options [x] = userOptions [x];
				}
			}
		
		function displayTabContents (tabRec) {
			const where = $(".divTabContent");
			
			function append (htmltext) {
				where.append (htmltext);
				if (getBoolean (tabRec.flJavaScriptDomFeatures)) {
					setupJavaScriptFeatures ();
					}
				}
			
			
			console.log ("displayTabContents: tabRec.name == " + tabRec.name);
			if (tabRec.getContent === undefined) {
				where.html (new Date ().toLocaleTimeString ());
				}
			else {
				where.empty ();
				if (tabRec.savedHtml === undefined) {
					tabRec.getContent (function (err, theContent) {
						if (err) {
							where.html (err.message);
							}
						else {
							tabRec.savedHtml = theContent;
							append (theContent);
							}
						});
					}
				else {
					append (tabRec.savedHtml);
					}
				}
			}
		function pushState (tabname) {
			var state = {
				tabname
				};
			history.pushState (state, "", location.pathname + "?tab=" + encodeURIComponent (stringLower (tabname)));
			}
		
		const ulTabs = $(".divScriptingTabs ul");
		var flFoundTab = false, firstTab = undefined;
		ulTabs.empty ();
		for (var x in theTabs) {
			const item = theTabs [x];
			if (item.enabled) {
				const icon = "<i class=\"iTabIcon " + item.icon + "\"></i>";
				const liTab = $("<li class=\"liTab\"><a data-toggle=\"tab\">" + icon + item.name + "</a></li>");
				if (firstTab === undefined) {
					firstTab = {
						liTab,
						item
						}
					}
				if (equalStrings (item.name, options.nameActiveTab)) {
					liTab.addClass ("active");
					displayTabContents (item);
					flFoundTab = true;
					}
				
				function handleClick () { //3/8/24 by DW
					console.log ("handleClick: item.name == " + item.name);
					$(".liTab").removeClass ("active");
					liTab.addClass ("active");
					displayTabContents (item);
					pushState (item.name);
					}
				liTab.on ("pointerdown", handleClick); //3/8/24 by DW
				
				ulTabs.append (liTab);
				}
			}
		
		if ((!flFoundTab) && (firstTab !== undefined)) {
			firstTab.liTab.addClass ("active");
			displayTabContents (firstTab.item);
			}
		
		activateToolTips ();
		window.addEventListener ("popstate", function (ev) {
			if (ev.state != null) {
				console.log ("popstate: ev.state.tabname == " + jsonStringify (ev.state.tabname));
				for (var x in theTabs) {
					var item = theTabs [x];
					if (item.name == ev.state.tabname) {
						displayTabContents (item);
						}
					}
				$(".liTab").removeClass ("active");
				$(".liTab").each (function () {
					if ($(this).text () == ev.state.tabname) {
						$(this).addClass ("active");
						}
					});
				}
			});
		}
//connection to feedland
	var appPrefs = {
		urlReaderApp: undefined
		};
	function getUsersBlogUrl () { 
		return (""); 
		}

function everyMinute () {
	var now = new Date ();
	if (now.getMinutes () == 0) {
		console.log ("\neveryMinute: " + now.toLocaleTimeString () + ", v" + myVersion);
		}
	riverItemsEveryMinute ();
	viewLastUpdateString ();
	$(".spRandomMotto").each (function () { //8/7/19 by DW
		$(this).text (getRandomSnarkySlogan ());
		});
	}
function everySecond () {
	riverItemsEverySecond ();
	$(".spHowLongRunning").each (function () { //8/9/19 by DW
		$(this).text ("This blog has been running for: " + howLongSinceStartAsString (new Date ("10/7/1994, 12:00 PDT")));
		});
	$(".spHowLongUntilThirty").each (function () { //10/6/24 by DW
		function howlong () {
			var whenThirty = new Date ("10/7/2024, 12:00 PDT");
			var now = new Date ();
			function howLongUntil (now, whenStart) { 
				function daysInYear (year) {
					var flLeapYear = ((year % 400) == 0) || ((year % 100) != 0 && ((year % 4) == 0));
					return ((flLeapYear) ? 366 : 365);
					}
				function daysInMonth (month, year) { 
					return (new Date (year, month, 0).getDate ()); 
					} 
				function getnum (num, units) {
					if (num != 1) {
						units += "s";
						}
					return (num + " " + units);
					}
				const ctSecsInDay = 60 * 60 * 24;
				const ctMilliSecsInDay = 1000 * ctSecsInDay;
				var theYear = whenStart.getFullYear ();
				var ctDays = (now - whenStart) / ctMilliSecsInDay;
				var ctYears = 0;
				while (true) {
					if (ctDays <= daysInYear (theYear)) {
						break;
						}
					ctDays -= daysInYear (theYear);
					ctYears++;
					theYear++;
					}
				
				var theMonth = 0, ctMonths = 0;
				while (true) {
					
					if (ctDays < daysInMonth (theMonth, theYear)) {
						break;
						}
					ctDays -= daysInMonth (theMonth, theYear);
					ctMonths++;
					theMonth++;
					}
				
				const ctWholeDays = Math.floor (ctDays);
				var ctRemainingSecs = (ctDays - ctWholeDays) * ctSecsInDay;
				var ctHours = Math.floor (ctRemainingSecs / (60 * 60));
				ctRemainingSecs -= ctHours * 60 * 60;
				var ctMinutes = Math.floor (ctRemainingSecs / 60);
				ctRemainingSecs -= ctMinutes * 60;
				ctRemainingSecs = Math.floor (ctRemainingSecs);
				return ({
					years: ctYears,
					months: ctMonths,
					days: ctWholeDays,
					hours: ctHours,
					minutes: ctMinutes,
					seconds: ctRemainingSecs
					});
				}
			
			var howlong = howLongUntil (whenThirty, now);
			
			var s = "";
			function addnum (num, label) {
				if (num > 0) {
					if (num == 1) {
						label = stringDelete (label, label.length, 1);
						}
					s += num + " " + label + ", ";
					}
				}
			addnum (howlong.days, "days");
			addnum (howlong.hours, "hours");
			addnum (howlong.minutes, "minutes");
			addnum (howlong.seconds, "seconds");
			if (endsWith (s, ", ")) {
				s = stringDelete (s, s.length - 1, 2);
				}
			return (s);
			}
		$(this).text (howlong ());
		});
	}
function viewLastUpdateString () { //9/28/17 by DW
	var whenstring = getFacebookTimeString (config.now, true); //2/25/18 by DW
	if (beginsWith (whenstring, "Yesterday")) {
		whenstring = "Yesterday";
		}
	$("#idLastScriptingUpdate").html ("Updated: " + whenstring + ".");
	}

function startBlogroll (callback) {
	console.log ("startBlogroll");
	if ($(".divSidebar").css ("display") != "none") {
		const flQuietMode = false; //7/31/24 by DW
		const theCheckbox = $(".divBlogrollQuietModeSwitch input"); 
		if (flQuietMode) { //4/17/24 by DW
			$(".divBlogrollContainer").css ("width", 220);
			}
		theCheckbox.prop ("checked", flQuietMode);
		
		const blogrollOptions = {
			urlFeedListOpml: appConsts.urlFeedListOpml,
			urlFeedlandViewBlogroll: appConsts.urlFeedlandViewBlogroll,
			whereToAppend: $(".divBlogrollContainer"), //3/15/24 by DW
			title: "Dave's Blogroll",
			flDisplayTitle: true,
			flQuietMode: flQuietMode,
			blogrollDisplayedCallback: function () {
				console.log ("blogrollDisplayedCallback");
				if (callback !== undefined) {
					callback ();
					}
				}
			};
		try { //2/28/24 by DW
			const theBlogroll = new blogroll (blogrollOptions);
			}
		catch (err) {
			console.log ("startBlogroll: err.message == " + err.message);
			return;
			}
		
		theCheckbox.change (function () { //4/20/24 by DW
			if (theCheckbox.is (':checked')) {
				blogrollOptions.flQuietMode = true;
				} 
			else {
				blogrollOptions.flQuietMode = false;
				}
			$(".divBlogrollContainer").empty ();
			blogroll (blogrollOptions);
			});
		}
	else {
		if (callback !== undefined) {
			callback ();
			}
		}
	}

function startup () {
	console.log ("startup");
	
	if (localStorage.wordpressMemory !== undefined) {
		wordpressMemory = JSON.parse (localStorage.wordpressMemory);
		}
	
	const allparams = getAllUrlParams ();
	
	
	
	
	const options = {
		nameActiveTab: allparams.tab
		};
	if (appConsts.flBlogrollEnabled) { //3/13/24 by DW
		startBlogroll (function () {
			buildTabsAsTabs (options);
			});
		}
	else {
		buildTabsAsTabs (options);
		}
	
	
	viewLastUpdateString ();
	self.setInterval (everySecond, 1000);
	runEveryMinute (everyMinute);
	everyMinute ();
	
	$("body").click (function () { //3/10/24 by DW
		console.log ("click");
		});
	
	hitCounter ();
	}
