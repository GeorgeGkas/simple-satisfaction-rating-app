$('#submit').click(function () {
  // Object which we'll save the answers.
  const data = {};

  // Flag used to check if all questions was answered.
  let allQuestionsWasAnswered = true;
  let unansweredQuestions = [];
  
  // Iterate each question.
  $('form').each(function () {
    $(this).find('.card').removeClass('card-error');

    const questionID = $(this).attr('data-form-category').replace(/\s/g, '_');

    data[questionID] = $(this).find('input.rating:checked').val(); // Get the question answer.

    if (!data[questionID]) { // If is undefined, then the question was not answer.
      allQuestionsWasAnswered = false;
      unansweredQuestions.push($(this));
    }
  });

  if (!allQuestionsWasAnswered) { // Do not submit until all questions are answered.
    $('#info').addClass('info-error').text('Please answer all the questions.');
    unansweredQuestions.forEach(($form) => {
      $form.find('.card').addClass('card-error');
    });
    return false;
  }

  // Submit the answers.
  $.ajax({
    type: 'POST',
    url: '/post-answers',
    dataType: 'text',
    data: {
      answers: data
    },
    success: function() {
      $('#info').removeClass('info-error').addClass('info-success').text('Your response was recorded successfully.');
      $('#submit').prop('disabled', true); // Prevent users from re-submit.
      window.location.replace(window.location + 'results');
    },
    error: function() {
      $('#info').addClass('info-error').text('We have encountered problems while sending your response. Please reload the page and start again.');
    }
  })
});