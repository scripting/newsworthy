const rightCaret = "fa fa-caret-right darkCaretColor", downCaret = "fa fa-caret-down lightCaretColor";

function howLongSinceStartAsString (whenStart) {
	var x = howLongSinceStart (whenStart);
	function getnum (num, units) {
		if (num != 1) {
			units += "s";
			}
		return (num + " " + units);
		}
	return (getnum (x.years, "year") + ", " + getnum (x.months, "month") + ", " + getnum (x.days, "day") + ", " + getnum (x.hours, "hour") + ", " + getnum (x.minutes, "minute") + ", " + getnum (x.seconds, "second") + ".");
	}

function initWedge (domObject, clickCallback) { //the caret goes to the left of the object -- 7/24/17 by DW
	var theIcon = $("<i class=\"" + rightCaret + "\"></i>");
	var theWedge = $("<span class=\"spScriptingNewsWedge\"></span>");
	$(theWedge).append (theIcon);
	$(domObject).prepend (theWedge);
	theWedge.click (function () {
		var className = $(theIcon).attr ("class");
		if (className == rightCaret) {
			clickCallback (true); //expand
			$(theIcon).attr ("class", downCaret);
			}
		else {
			clickCallback (false); //collapse
			$(theIcon).attr ("class", rightCaret);
			}
		});
	return (theWedge);
	}
function setupExpandableType (attname, htmlTemplate) {
	function fixYoutubeUrl (url) { //3/18/18; by DW
		const prefix = "https://www.youtube.com/watch?v=";
		if (beginsWith (url, prefix)) {
			url = "https://www.youtube.com/embed/" + stringDelete (url, 1, prefix.length);
			}
		return (url);
		}
	$(".divPageBody li, .divSingularItem").each (function () {
		var parentOfTweet = this, theObject = undefined;
		var theText = $(this).text ();
		var attval = $(this).data (attname.toLowerCase ());
		if (attval !== undefined) {
			if (attname == "urlvideo") { //3/18/18; by DW
				attval = fixYoutubeUrl (attval);
				}
			initWedge (parentOfTweet, function (flExpand) {
				function exposetheObject () {
					$(theObject).slideDown (0, 0, function () {
						$(theObject).css ("visibility", "visible");
						});
					}
				if (flExpand) {
					if (theObject === undefined) {
						let htmltext = replaceAll (htmlTemplate, "[%attval%]", attval);
						theObject = $(htmltext);
						$(parentOfTweet).append (theObject);
						exposetheObject ();
						}
					else {
						exposetheObject ();
						}
					}
				else {
					$(theObject).slideUp (0, 0, function () {
						});
					}
				});
			}
		});
	}
function setupExpandableImages () {
	setupExpandableType ("urlexpandableimage", "<img class=\"imgExpandable\" src=\"[%attval%]\">");
	}
function setupExpandableVideo () {
	setupExpandableType ("urlvideo", "<iframe width=\"560\" height=\"315\" src=\"[%attval%]\" frameborder=\"0\" allowfullscreen></iframe>");
	}
function setupExpandableDisqusThreads () {
	const myDisqusGroup = "scripting";
	
	function getDisqusCommentsText (thispageurl, disqusGroup) {
		var s = "";
		if (disqusGroup === undefined) {
			disqusGroup = myDisqusGroup;
			}
		if (thispageurl === undefined) {
			thispageurl = window.location.href;
			}
		var disqusTextArray = [
			"\n<div class=\"divDisqusComments\">\n",
				"\t<div id=\"disqus_thread\"></div>\n",
				"\t<script>\n",
					"\t\tvar disqus_config = function () {\n",
						"\t\t\tthis.page.url = \"" + thispageurl + "\"; \n",
						"\t\t\t};\n",
					"\t\t(function () {  \n",
						"\t\t\tvar d = document, s = d.createElement ('script');\n",
						"\t\t\ts.src = '//" + disqusGroup + ".disqus.com/embed.js';  \n",
						"\t\t\ts.setAttribute ('data-timestamp', +new Date());\n",
						"\t\t\t(d.head || d.body).appendChild(s);\n",
						"\t\t\t})();\n",
					"\t\t</script>\n",
				"\t</div>\n"
			];
		for (var i = 0; i < disqusTextArray.length; i++) {
			s += disqusTextArray [i];
			}
		console.log ("getDisqusCommentsText: " + s);
		
		return (s)
		}
	
	function startDisqus (disqusGroup) {
		(function() {
			var dsq = document.createElement ('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = '//' + disqusGroup + '.disqus.com/embed.js';
			$("body").appendChild (dsq);
			})();
		}
		
	setupExpandableType ("flExpandableDisqusThread", "<div class=\"divDisqusThread\"><div id=\"disqus_thread\"></div></div>");
	startDisqus (myDisqusGroup);
	}
function setupTweets () {
	function getEmbedCode (id, callback) {
		var url = "http://twitterembed.scripting.com/getembedcode?id=" + encodeURIComponent (id);
		$.ajax ({
			type: "GET",
			url: url,
			success: function (data) {
				callback (data);
				},
			error: function (status) { 
				console.log ("getEmbedCode: error == " + JSON.stringify (status, undefined, 4));
				callback (undefined); 
				},
			dataType: "json"
			});
		}
	function viewTweet (idTweet, idDiv, callback) { //12/22/19 by DW
		var idViewer = "#" + idDiv, now = new Date ();
		if (idTweet == undefined) {
			$(idViewer).html ("");
			}
		else {
			getEmbedCode (idTweet, function (struct) {
				$(idViewer).css ("visibility", "hidden");
				$(idViewer).html (struct.html);
				if (callback != undefined) {
					callback (struct);
					}
				});
			}
		$(idViewer).on ("load", function () {
			$(idViewer).css ("visibility", "visible");
			});
		}
	$(".divPageBody li, .divSingularItem").each (function () {
		var parentOfTweet = this, tweetObject = undefined;
		var theText = $(this).text ();
		var urlTweet = $(this).data ("urltweet");
		
		var tweetId = $(this).data ("tweetid"), tweetUserName = $(this).data ("tweetusername"); //11/16/17 by DW
		if ((tweetId !== undefined) && (tweetUserName !== undefined) && (urlTweet === undefined)) {
			urlTweet = "https://twitter.com/" + tweetUserName + "/status/" + tweetId;
			}
		
		if (urlTweet !== undefined) {
			let idTweet = stringLastField (urlTweet, "/");
			initWedge (parentOfTweet, function (flExpand) {
				$(this).blur (); //12/22/19 by DW
				function exposeTweetObject () {
					$(tweetObject).slideDown (75, undefined, function () {
						$(tweetObject).on ("load", function () {
							$(tweetObject).css ("visibility", "visible");
							});
						});
					}
				if (flExpand) {
					if (tweetObject === undefined) {
						let tweetObjectId = "tweet" + idTweet;
						let htmltext = "<div class=\"divEmbeddedTweet\" id=\"" + tweetObjectId + "\"></div>";
						tweetObject = $(htmltext);
						$(parentOfTweet).append (tweetObject);
						if (twStorageData.urlTwitterServer === undefined) { //11/15/18 by DW
							console.log ("setupTweets: twStorageData.urlTwitterServer == undefined");
							twStorageData.urlTwitterServer = urlLikeServer; //whack the bug -- 11/23/18 by DW
							}
						viewTweet (idTweet, tweetObjectId, function () {
							exposeTweetObject ();
							});
						}
					else {
						exposeTweetObject ();
						}
					}
				else {
					$(tweetObject).slideUp (75);
					}
				});
			}
		});
	}
function setupMastodonToots () { //4/9/23 by DW
	$(".divPageBody li, .divSingularItem").each (function () {
		const urltoot = $(this).data ("urltoot");
		var parentOfToot = this, tootObject = undefined;
		if (urltoot !== undefined) {
			console.log ("setupMastodonToots: urltoot == " + urltoot); 
			initWedge (parentOfToot, function (flExpand) {
				if (flExpand) {
					function exposeTootObject () {
						$(tootObject).slideDown (75, undefined, function () {
							$(tootObject).css ("visibility", "visible");
							});
						}
					if (tootObject === undefined) {
						const domain = urltoot.split ("/") [2];
						const urlembed = "https://" + domain + "/api/oembed?url=" + encodeURIComponent (urltoot);
						readHttpFile (urlembed, function (jsontext) {
							if (jsontext !== undefined) {
								const jstruct = JSON.parse (jsontext);
								console.log ("setupMastodonToots: jsontext == " + jsonStringify (jstruct));
								tootObject = $("<div class=\"divEmbeddedToot\"></div>");
								const embeddedObject = $(jstruct.html);
								embeddedObject.attr ("width", 500);
								$(tootObject).append (embeddedObject);
								$(parentOfToot).append (tootObject);
								exposeTootObject ();
								}
							});
						}
					else {
						exposeTootObject ();
						}
					}
				else {
					$(tootObject).slideUp (75);
					}
				});
			}
		});
	}
function setupExpandableOutline () {
	$(".divPageBody li").each (function () {
		var ul = $(this).next ();
		var parentOfTweet = this, tweetObject = undefined;
		var theText = $(this).text ();
		var collapse = $(this).data ("collapse");
		if (getBoolean (collapse)) {
			initWedge (this, function (flExpand) {
				if (flExpand) {
					$(ul).slideDown (75, undefined, function () {
						$(ul).css ("display", "block");
						});
					}
				else {
					$(ul).slideUp (75);
					}
				});
			}
		});
	}
function setupXrefs () {
	$(".divPageBody li, .divSingularItem").each (function () {
		var theText = $(this).text ();
		var xref = $(this).data ("xref");
		if (xref !== undefined) {
			var theListItem = this, outlineObject = undefined;
			var fname, folder, url;
			if (stringContains (xref, "#")) {
				fname = "a" + stringDelete (stringNthField (xref, "#", 2), 1, 1) + ".json"
				folder = replaceAll (stringNthField (xref, "#", 1),  ".html", "");
				}
			else { //handle xrefs that point to story pages -- 7/13/18 by DW
				fname = "a" + stringPopExtension (stringLastField (xref, "/")) + ".json";
				folder = stringPopLastField (xref, "/");
				}
			url = replaceAll (folder, "scripting.com/", "scripting.com/data/items/") + "/" + fname; //2/6/20 by DW
			
			console.log ("setupXrefs: url == " + url);
			
			initWedge (theListItem, function (flExpand) {
				if (flExpand) {
					function exposeOutlineObject () {
						$(outlineObject).slideDown (75, undefined, function () {
							$(outlineObject).css ("display", "block");
							
							});
						}
					if (outlineObject === undefined) {
						readHttpFile (url, function (jsontext) {
							if (jsontext !== undefined) {
								var jstruct = JSON.parse (jsontext), permalinkString = "", htmltext;
								
								if (jstruct.created !== undefined) {
									permalinkString = "<div class=\"divXrefPermalink\"><a href=\"" + xref + "\">" + formatDate (jstruct.created, "%b %e, %Y") + "</a></div>";
									}
								
								if (jstruct.subs !== undefined) {
									htmltext = renderOutlineBrowser (jstruct, false, undefined, undefined, true);
									}
								else {
									htmltext = jstruct.text;
									}
								
								htmltext = "<div class=\"divXrefOutline\">" + permalinkString + htmltext + "</div>";
								
								outlineObject = $(htmltext);
								
								$(theListItem).append (outlineObject);
								
								exposeOutlineObject ();
								
								}
							});
						}
					else {
						exposeOutlineObject ();
						}
					}
				else {
					$(outlineObject).slideUp (75);
					}
				});
			}
		});
	}
function setupSpoilers () {
	$(".spSpoiler").each (function () {
		var spoilertext = $(this).html ();
		console.log ("setupSpoilers: spoilertext == " + spoilertext);
		console.log ("setupSpoilers");
		$(this).text ("[Spoilers.]");
		$(this).css ("display", "inline");
		$(this).mousedown (function () {
			console.log ("setupSpoilers: spoilertext == " + spoilertext);
			$(this).text (spoilertext);
			});
		});
	}
function setupTagrefs () { //7/17/21 by DW
	tagrefDialogStartup ();
	}

function setupJavaScriptFeatures () { //1/15/19 by DW
	setupXrefs (); //7/13/17 by DW
	setupTweets (); //7/24/17 by DW
	setupExpandableImages (); //7/24/17 by DW
	setupExpandableVideo (); //10/9/17 by DW
	setupExpandableOutline (); //5/15/18 by DW
	setupSpoilers (); //3/3/20 by DW
	setupTagrefs (); //7/17/21 by DW
	setupMastodonToots (); //4/9/23 by DW
	try { //9/21/19 by DW
		if (modalImageViewStartup !== undefined) { //6/25/18 by DW
			modalImageViewStartup (); 
			}
		}
	catch (err) {
		}
	}
