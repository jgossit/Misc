QUnit.jUnitReport = function(report) {
	console.log(report.xml);
};

$(function()
{
	$('#ui').load('childrensGame.html #ui', function()
	{
		loadui();
		countDelay = 0;
		
		asyncTest('play (numChildren=8, removeOnCount=5)', function() { playTest(8,5); });
		asyncTest('play (numChildren=4, removeOnCount=3)', function() { playTest(4,3); });
		asyncTest('play (numChildren=16, removeOnCount=10)', function() { playTest(16,10); });
		asyncTest('invalid number of children (numChildren=' + (NUM_CHILDREN_MIN-1) + ')', function() { invalidNumChildrenTest(NUM_CHILDREN_MIN-1); });
		asyncTest('invalid number of children (numChildren=' + (NUM_CHILDREN_MAX+1) + ')', function() { invalidNumChildrenTest(NUM_CHILDREN_MAX+1); });
		asyncTest('invalid number of children (numChildren=ABC)', function() { invalidNumChildrenTest('ABC'); });
		asyncTest('invalid remove on count (removeOnCount=' + (REMOVE_ON_COUNT_MIN-1) + ')', function() { invalidRemoveOnCountTest(REMOVE_ON_COUNT_MIN-1); });
		asyncTest('invalid remove on count (removeOnCount=' + (REMOVE_ON_COUNT_MAX+1) + ')', function() { invalidRemoveOnCountTest(REMOVE_ON_COUNT_MAX+1); });
		asyncTest('invalid remove on count (removeOnCount=XYZ)', function() { invalidRemoveOnCountTest('XYZ'); });
		test('buttonCoOrds (numChildren=4)', function() { buttonCoOrdsTest(4); });
		test('buttonCoOrds (numChildren=8)', function() { buttonCoOrdsTest(8); });
		test('buttonCoOrds (numChildren=13)', function() { buttonCoOrdsTest(13); });
	});
});

function playTest(numChild, removeOn)
{
	numChildren = numChild;
	removeOnCount = removeOn;
	play();
	setTimeout(function()
	{
		ok(finishedPlaying, 'Game has finished playing = ' + finishedPlaying);
		equal(childrenRemaining.length, 1, 'Number of children remaining (should be 1) = ' + childrenRemaining.length);
		equal(childrenOut.length, numChildren-1, 'Number of children out (should be ' + (numChildren-1) + ') = ' + childrenOut.length);
		for (var i=0; i<numChildren; i++)
		{
			var childAccountedFor = (childrenOut.indexOf(i+1) != -1 || childrenRemaining[0] == i+1);
			ok(childAccountedFor, 'Child ' + (i+1) + ' accounted for = ' + childAccountedFor); 
		}
		var resultsOpen = $('#results').dialog('isOpen');
		ok(resultsOpen, 'Results dialog is displayed = ' + resultsOpen);
		closeResults();
		start();
	}, 2000 );
}

function invalidNumChildrenTest(numChild)
{
	numChildren = numChild;
	invalidInputTest();
}
function invalidRemoveOnCountTest(removeOn)
{
	removeOnCount = removeOn;
	invalidInputTest();
}
function invalidInputTest()
{
	play();
	setTimeout(function()
	{
		var errorOpen = $('#error').dialog('isOpen');
		ok(errorOpen, 'Error dialog is displayed = ' + errorOpen);
		closeError();
		start();
	}, 200 );
}

function buttonCoOrdsTest(numChildren)
{
	var buttonCoOrdsArray = new Array();
	for (var i=0; i<numChildren; i++)
	{
		var buttonCoOrds = getButtonCoOrds(numChildren, i);
		var buttonCoOrdsArrayIndex = buttonCoOrdsArray.indexOf(buttonCoOrds);
		ok(buttonCoOrdsArrayIndex == -1, 'Button co-ords is unique = ' + buttonCoOrdsArrayIndex == -1);
		buttonCoOrds.x = buttonCoOrds.x.replace('%','');
		buttonCoOrds.y = buttonCoOrds.y.replace('%','');
		var buttonCoOrdsValid = (buttonCoOrds.x >= 10 && buttonCoOrds.x <= 90 && buttonCoOrds.y >= 10 && buttonCoOrds.y <= 90);
		ok(buttonCoOrdsValid, 'Button co-ords are valid (x/y >= 10 and <= 90) = ' + buttonCoOrdsValid + '(' + buttonCoOrds.x + ',' + buttonCoOrds.y + ')');
	}
}