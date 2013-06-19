/* Constants */
var COLOR_CHILD_SELECTED = 'LimeGreen';
var COLOR_CHILD_UNSELECTED = 'rgb(218,218,218)';
var COLOR_CHILD_OUT = 'Tomato';
var NUM_CHILDREN_MIN = 2;
var NUM_CHILDREN_MAX = 16;
var NUM_CHILDREN_DEFAULT = 8;
var REMOVE_ON_COUNT_MIN = 1;
var REMOVE_ON_COUNT_MAX = 20;
var REMOVE_ON_COUNT_DEFAULT = 5;

function loadui()
{
	$('#numChildren').spinner({min: NUM_CHILDREN_MIN, max: NUM_CHILDREN_MAX});
	$('#numChildren').spinner('value', NUM_CHILDREN_DEFAULT);
	$('#removeOnCount').spinner({min: REMOVE_ON_COUNT_MIN, max: REMOVE_ON_COUNT_MAX});
	$('#removeOnCount').spinner('value', REMOVE_ON_COUNT_DEFAULT);

	$('#playButton').button().click(function()
	{
		$('#playButton').button('disable');
		numChildren = $('#numChildren').val();
		removeOnCount = $('#removeOnCount').val();
		play();
	});
	
	$('.ui-spinner, #playButton').css('margin-bottom','10px');
	
	$('#board').css('width','95%').css('position','absolute');
	resizeBoard();
	$(window).resize(function(){ resizeBoard(); });
}
function resizeBoard()
{
	var boardHeight = $(document).height() - $('#controls').height() - 30;
	$('#board').css('height', boardHeight + 'px');
	if ($('#error').text() != '')
		$('#error').dialog( "option", "position", { my: "center", at: "center", of: '#board', within: '#board'} );
	if ($('#results').text() != '')
		$('#results').dialog( "option", "position", { my: "center", at: "center", of: '#board', within: '#board'} );
}

var finishedPlaying = false;
var countDelay = 500;
var numChildren;
var removeOnCount;
var childrenRemaining;
var childrenOut;
var position;
var count;

function init()
{
	childrenRemaining = new Array();
	childrenOut = new Array();
	for (var i=0; i<numChildren; i++)
		childrenRemaining.push(i+1);
	position = 0;
	count = 1;
	childSelect(position);
}

function drawBoard()
{
	$('#board').empty();
	$('#board').append('<div id="results" title="Results"></div>');
	$('#results').dialog({ autoOpen: false,
						   appendTo: '#board',
						   close: function( event, ui ) { closeResults(); reset(); },
						   position: { my: "center", at: "center", of: '#board', within: '#board'}, 
						   modal: true,
						   buttons: [{text: 'OK', click: function() { closeResults(); reset(); } }] });
	
	$('#board').append('<div id="count" class="count">1</div>');
	$('#count').css('position','absolute').css('left','50%').css('top','50%');
	for (var i=0; i<numChildren; i++)
	{
		$('#board').append('<button id="childButton'+(i+1)+'">Child #'+(i+1)+'</button>');	
		$('#childButton'+(i+1)).button();
		var buttonCoOrds = getButtonCoOrds(numChildren, i);
		$('#childButton'+(i+1)).css('position','absolute').css('left',buttonCoOrds.x).css('top',buttonCoOrds.y);
	}
}

/* Find co-ordinates for the child button on the circumference of imaginary circle in the board */
function getButtonCoOrds(numChildren, childNumber)
{
	var radians = ((2*Math.PI) / numChildren) * childNumber;
	var buttonX = (1 + Math.cos(radians)) * 50; // (1+1) * 50 = 100% max
	buttonX = Math.max(10, Math.min(90,buttonX)); // pad in 10% from the edges
	buttonX = Math.round(buttonX);
	var buttonY = (1 + Math.sin(radians)) * 50;
	buttonY = Math.max(10, Math.min(90,buttonY));
	buttonY = Math.round(buttonY);
	return {x:buttonX+'%',y:buttonY+'%'};
}

function childSelect(position)
{
	$('#childButton'+(childrenRemaining[position])).css('background-color',COLOR_CHILD_SELECTED);
}
function childUnselect(position)
{
	$('#childButton'+(childrenRemaining[position])).css('background-color',COLOR_CHILD_UNSELECTED);
}
function childOut(position)
{
	$('#childButton'+(childrenRemaining[position])).css('background-color',COLOR_CHILD_OUT);
}

function showError(message)
{
	$('#error').dialog({modal: true,
						close: function( event, ui ) { closeError(); },
						position: { my: "center", at: "center", of: '#board', within: '#board'},
						buttons: [{text: 'OK', click: function() { closeError(); } }] });
	$('#error').append(message);
}
function closeError()
{
	$('#error').dialog('close');
	$('#error').empty();
	$('#playButton').button('enable');
}

function play()
{
	if (!$.isNumeric(numChildren) || numChildren > NUM_CHILDREN_MAX || numChildren < NUM_CHILDREN_MIN)
	{
		showError(invalidNumChildren);
		return;
	}
	if (!$.isNumeric(removeOnCount) || removeOnCount > REMOVE_ON_COUNT_MAX || removeOnCount < REMOVE_ON_COUNT_MIN)
	{
		showError(invalidRemoveOnCount);
		return;
	}
	init();
	drawBoard();
	setTimeout(function() {	move();	}, countDelay);
}

function move()
{
	if (childrenRemaining.length == 1)
	{
		finishedPlaying = true;
		showResults();
		return;
	}
	else if (count < removeOnCount) // haven't reached unlucky child yet
	{
		childUnselect(position);
		count++;
		position++;
		if (position == childrenRemaining.length) // last child, go back to the start
			position = 0;
		childSelect(position);
	}
	else // reached unlucky child
	{
		childOut(position);
		childrenOut.push(childrenRemaining.splice(position,1)[0]);
		count = 1;
		if (position == childrenRemaining.length) // last child, no next child to slide into position, go back to the start
			position = 0;
		childSelect(position);
	}
	
	$('#count').text(count);
	setTimeout(function() {	move(); }, countDelay);
}

function showResults()
{
	for (var i=0; i<childrenOut.length; i++)
		$('#results').append(sprintf(childWentOut, childrenOut[i]) + '<br>');
	$('#results').append('<br>' + sprintf(childWinner, childrenRemaining[0]));
	$('#results').dialog('open');
	$('#playButton').button('enable');
}

function closeResults()
{
	$('#results').dialog('close');
}
function reset()
{
	$('#board').empty();
	finishedPlaying = false;
}