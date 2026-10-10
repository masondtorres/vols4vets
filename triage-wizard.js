(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('[data-triage-form]');
    var result = document.querySelector('[data-triage-result]');
    if (!form) return;
    var questions = Array.from(form.querySelectorAll('fieldset.question-card'));
    var submit = form.querySelector('button[type="submit"]');
    if (questions.length !== 5 || !submit) return;

    var index = 0;
    var controls = document.createElement('div');
    controls.className = 'wizard-controls no-print';
    controls.innerHTML = '<p class="wizard-progress" data-wizard-progress role="status" aria-live="polite"></p>' +
      '<p class="wizard-error" data-wizard-error role="alert" hidden></p>' +
      '<div class="wizard-buttons"><button class="button button-secondary" type="button" data-wizard-back>Back</button>' +
      '<button class="button" type="button" data-wizard-next>Continue</button></div>';
    form.insertBefore(controls, submit);
    var back = controls.querySelector('[data-wizard-back]');
    var next = controls.querySelector('[data-wizard-next]');
    var progress = controls.querySelector('[data-wizard-progress]');
    var error = controls.querySelector('[data-wizard-error]');

    var crisisNotice = document.createElement('div');
    crisisNotice.className = 'danger-box wizard-crisis';
    crisisNotice.hidden = true;
    crisisNotice.innerHTML = '<strong>Need help now?</strong> If there is immediate danger, call <a href="tel:911">911</a>. ' +
      'For veteran crisis support, call <a href="tel:988">988 and press 1</a> or text ' +
      '<a href="sms:838255">838255</a>. You do not have to finish these questions to seek help.';
    form.insertBefore(crisisNotice, questions[0]);

    function selected(name) {
      return form.querySelector('[name="' + name + '"]:checked');
    }
    function showCrisis() {
      var issue = selected('issue');
      var urgency = selected('urgency');
      crisisNotice.hidden = !((issue && issue.value === 'Crisis or immediate danger') ||
        (urgency && urgency.value === 'Immediate danger'));
    }
    function showStep(newIndex, focus) {
      index = Math.max(0, Math.min(questions.length - 1, newIndex));
      questions.forEach(function (question, n) { question.hidden = n !== index; });
      progress.textContent = 'Question ' + (index + 1) + ' of ' + questions.length;
      error.hidden = true;
      error.textContent = '';
      back.hidden = index === 0;
      next.hidden = index === questions.length - 1;
      submit.hidden = index !== questions.length - 1;
      if (focus) {
        var legend = questions[index].querySelector('legend');
        if (legend) {
          legend.setAttribute('tabindex', '-1');
          legend.focus();
        }
      }
      showCrisis();
    }
    function validStep() {
      if (index === 3) return true;
      var current = questions[index].querySelector('input:checked');
      if (current) return true;
      error.textContent = 'Choose one answer to continue.';
      error.hidden = false;
      var first = questions[index].querySelector('input');
      if (first) first.focus();
      return false;
    }
    next.addEventListener('click', function () {
      if (validStep()) showStep(index + 1, true);
    });
    back.addEventListener('click', function () {
      showStep(index - 1, true);
    });
    form.addEventListener('change', function (event) {
      if (event.target.name === 'ready') {
        var none = form.querySelector('[name="ready"][value="None of these ready"]');
        if (none && none.checked && event.target !== none) none.checked = false;
        if (none && event.target === none && none.checked) {
          form.querySelectorAll('[name="ready"]').forEach(function (item) {
            if (item !== none) item.checked = false;
          });
        }
      }
      showCrisis();
    });
    if (result) {
      result.addEventListener('click', function (event) {
        if (event.target.closest('[data-start-over]')) showStep(0, true);
      });
    }
    form.classList.add('wizard-enhanced');
    showStep(0, false);
  });
})();
