/**
 * This function has a hook to capture form submit event
 * Use cases: server-side form validation before submit to BPM or
 * a submission to a 3rd party system
 *
 * @param {Object} submission   - form submission
 * @param {string} id           - unique id of the form
 * @return {string}             - Error description
 *
 **/

function formio_on_submit(submission, id) {
  var error = undefined;

  //if (id == ) {}

  return error;
};

/**
 * This function has a hook to capture form creation event
 *
 * @param  {Object} submission   - form submission object
 * @param  {string} id           - unique id of the form
 * @return {Object}              - Return submission object
 *
 **/

function formio_on_render(submission, id) {
  // if id
  return submission;
}

/**
 * This function has a hook to capture form change event
 * Use cases: dynamically load data
 *
 * @param  {Object} submission   - form submission object
 * @param  {string} id           - unique id of the form
 * @return {Object}              - Return submission object
 *
 **/

function formio_on_change(event, id, form) {
};

