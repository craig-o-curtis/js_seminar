/* jquery functionality */

$(document).ready(function(){
	/* animatedscroll */
	/**** resets to top on page reload ****/
	$('body').animatescroll();
	$('#main_button, .lesson_button, .xp_button, #back_to_top').click(function(){
		/* $('.album').animatescroll({scrollSpeed:1000,easing:'easeInOutBack'}); */
	    var $target = $(this).data("target");
	    $($target).slideDown("fast").animatescroll({scrollSpeed:2000,easing:'easeInOutBack'});
	});
	/* recenters modal */
	$('.close_modal').click(function(){
		var $target = $(this).data("target");
	    $($target).animatescroll({scrollSpeed:2000,easing:'easeInOutBack'});
	});

	/* shuts all lesson content */
	var $backTop = $('#back_to_top');
	var $lessonChoices = $('#lesson_choices');
	var $lesson = $('.lesson');
	var $mainButton = $('#main_button');
	$backTop.click(function(){
		$lesson.slideUp(2000);
		$lessonChoices.delay(1000).slideUp(1000);
	});

	/* animates navbar opacity */
	var $navbar = $('.navbar');
	$navbar.click(function(){
		$(this).toggleClass('navbar-open');
	});

	/*** progress bar incrementer ***/
	var $progTotal = $lesson.length;
	var $newValue;
	var $xpButton = $('.xp_button');
	var $resetButton = $('#reset_button');

	/* sets progressbar total to total number of lessons */
	var $progbar = $('#progbar');
	$progbar.attr('max', $progTotal);
	var $showMax = $progbar.attr('max');
	
	/*** increments lessons and adds index ***/
	var $quizButton = $('.quiz_button');
	$quizButton.attr('disabled', true);
	$lesson.each(function( index ) {
	  /* unsure if added data-lessonNumber attribure */
	  $(this).data('.lessonNumber', (index + 1)); /*** TEST added . for class ***/
	  /* find number of modals per lesson. */
	  var $modalNumber = 0;
	  $(this).find('.modal_button').each(function( index ) {
	  	$modalNumber = (index + 1);
	  });
	  $(this).data('modalButtonTotal', $modalNumber);
	});

	/*** adds progressbar and checks ****/
	$xpButton.on("click", function(){
		var $progbarVal = $progbar.val();
		var $alert = $(".alert");
		if( $(this).hasClass('xp_added') ){
			/* find out with closest the index+1 of this lesson */
			var $lessonNumber = $(this).closest('.lessonModal_box').find('.lessonNumber').text();
			/* alert */
			$alert.alert();
			$alert.addClass('in');
			$alert.addClass('fade');
			$alert.find('strong').html("You have already completed the " + $lessonNumber + "!");
		} else {
			$newValue = ($progbarVal + 1);
			$progbar.addClass('progress-striped progress-animated');
			$progbar.html( ( Math.ceil($newValue / $progTotal * 100) ) + "%");
		}
		$(this).addClass('xp_added btn-warning-outline').html("Back to top").removeClass('btn-warning');
		$progbar.val($newValue);
		if ($progbarVal >= $progTotal) {
			$progbarVal = 0;
		}
		$lesson.slideUp();
		$('#lesson_choices').slideUp(2000);
		$mainButton.html('Continue');
	});

	/* star rating animations */
	var $starContainer = $('.star_container');
	var $lessonButton = $('.lesson_button');
	$starContainer.hide();
	$lessonButton.on("click", function(){
		$(this).next($starContainer).show("slow").addClass('star_container_grow');
	});

	/* modals */
	var $overlay = $('.overlay');
	$overlay.hide();
	var $modalCounter = 0;
	$('.modal_button').click(function(){
		var $targetModal = $(this).data("get");
		$($targetModal).addClass('open_lessonModal').fadeToggle();		
		/* need to increment here to eventually show quiz_button */
		var $lessonModalTotal = $(this).data('modalButtonTotal', $modalCounter);
		var $thisLessonModals = $(this).closest('.lesson').data('modalButtonTotal');
		if ($(this).hasClass('modalAlreadyClicked') === false) {
			$modalCounter++;	
		} 
		$(this).addClass('modalAlreadyClicked modal_finished');
		if ( ($modalCounter ) === $thisLessonModals - 1 ) {
			$(this).closest('.lesson').find($quizButton).attr('disabled', false).html('Take Quiz!');;
		}
		var $thisXpButton = $(this).closest('.lesson').find($xpButton);
		$thisXpButton.text('Click ' + ($thisLessonModals - $modalCounter) + ' buttons before quiz!');
		if ( $modalCounter === $thisLessonModals - 1 ) {
			$modalCounter = 0;
		}
	});
	$('.close_modal').click(function(){
		$(this).closest($overlay).removeClass('.open_lessonModal').fadeOut();
	});

	/* modal tabs */
	var tabs = $( ".tabs" ).tabs();
    tabs.find( ".ui-tabs-nav" ).sortable({
      axis: "x",
      stop: function() {
        tabs.tabs( "refresh" );
      }
  	});

  	/* quiz functionality */
  	$xpButton.hide();
  	var $answers = $('.answerChoice');
  	var $questionCount = 0;
  	$answers.click(function(){
  		var $question = $(this).closest('.question');
  		var $questionData = $question.data("get");
  		if ($question.hasClass('question_answered')){
  			/* do sth here later */
  			console.log('Question complete');
  		} else {
  			var $tabTarget = $(this).parent('div').attr('id');
  			var $lessonStar = $question.data('get');
  			$(this).closest('.question')
	  		if ($(this).hasClass('key')){
	  			$(this).addClass('answerChoice_correct');
	  			$(this).closest('.tabs').find('[href="#'+ $tabTarget +'"]').find('i.fa').removeClass('fa-star-o').addClass('fa-star');
	  			$($lessonStar).removeClass('fa-star-o').addClass('fa-star');
	  			
	  		} else {
	  			$(this).addClass('answerChoice_incorrect');
	  			$(this).siblings('.key').addClass('answerChoice_correct');
	  			$(this).closest('.tabs').find('[href="#'+ $tabTarget +'"]').find('i.fa').removeClass('fa-star-o').addClass('fa-star fa-star-red');
	  			$($lessonStar).removeClass('fa-star-o').addClass('fa-star fa-star-red');
	  		}
	  		$question.addClass('question_answered');
	  		$questionCount++;
	  	}
	  	var $questionGoal = $(this).closest('.tabs').find('.question').length;
	  	if ($questionCount === $questionGoal) {
	  		$(this).closest('.lessonModal_content').find($xpButton).fadeIn();
	  		$questionCount = 0; /* resents $xpButton display */
	  	}
  	});

	/*** reset button ***/
	$resetButton.click(function(){
		$newValue = 0;
		$progbarVal = 0;
		$progbar.val(0);
		$xpButton.each(function(){
			$(this).removeClass('xp_added');
		});
		$mainButton.html('Start Over');
		$('i.fa-star').removeClass('fa-star fa-star-red').addClass('fa-star-o');
		$('div.question').removeClass('question_answered');
		$('p.answerChoice').removeClass('answerChoice_correct answerChoice_incorrect');
		$questionCount = 0;
		$xpButton.removeClass('xp_added btn-warning-outline').addClass('btn-warning').html("Collect XP");
		$starContainer.removeClass('star_container_grow').hide();
		$xpButton.hide();
		$modalNumber = 0;
		$modalCounter = 0;
		$quizButton.attr('disabled', true).text('Quiz');
		$('.modal_button').removeClass('modalAlreadyClicked modal_finished');
	});
});