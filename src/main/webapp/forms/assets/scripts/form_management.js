/**
 * Returns a parameter value for an URL
 *
 * @param  {string} name   - parameter name
 * @param  {string} url    - URL
 * @return {string}        - value of a parameter
 *
 * Source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/2880929#2880929
 **/

function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Returns a Task information object from Camunda REST API
 *
 * @param {string} taskId   - Unique global Task Id
 * @param {string} rest_url - Camunda REST API endpoint
 * @return {Object}         - Task info structure
 *
 **/

function getTaskInfo(taskId, rest_url) {
  var headers = new Headers();
  if (configuration["camundaHeaderAuth"] != "") headers.append(configuration["camundaHeaderAuth"], configuration["camundaHeaderDigest"]);

  return fetch(rest_url + '/' + 'task' + '/' + taskId, { headers : headers },
).then(function(response) {
       return response.json(); // Transform to JSON
    }).then(function(rJSON) {
       return rJSON;
       console.log(rJSON);
    }).catch(function(error){return error});
}

/**
 * Returns local task variables
 *
 * @param {string} taskId   - Unique global Task Id
 * @param {string} rest_url - Camunda REST API endpoint
 * @return {Object} - Variables structure
 *
 **/

function getTaskVariables(taskId, rest_url) {
  var headers = new Headers();
  if (configuration["camundaHeaderAuth"] != "") headers.append(configuration["camundaHeaderAuth"], configuration["camundaHeaderDigest"]);

  return fetch(rest_url + '/' + 'task' + '/' + taskId + '/variables?deserializeValues=true',  { headers : headers }
    ).then(function(response) {
       return response.json(); // Transform to JSON
   }).then(function(rJSON) {
       return rJSON;
       console.log(rJSON);
   }).catch(function(error){return error});
};

/**
 * Returns process variables
 *
 * @param {string} processInstanceId   - Unique global Process Id
 * @param {string} rest_url            - Camunda REST API endpoint
 * @return {Object}                    - Variables structure
 *
 **/

function getProcessVariables(processInstanceId, rest_url) {
  var headers = new Headers();
  if (configuration["camundaHeaderAuth"] != "") headers.append(configuration["camundaHeaderAuth"], configuration["camundaHeaderDigest"]);

  return fetch(rest_url + '/' + 'process-instance' + '/' + processInstanceId +'/variables?deserializeValues=true', { headers : headers }
    ).then(function(response) {
       if (response.ok) {
         return response.json(); // Transform to JSON
       } else {
         // Add error handling here
       }
     }).then(function(rJSON) {
       return rJSON;
       console.log(rJSON);
   }).catch(function(error){return error});
};

function stripHTML(html){
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

/**
 * Submits form values
 *
 * @param {string} taskId   - Unique global Task Id
 * @param {string} rest_url - Camunda REST API endpoint
 * @return {response}       - Response object if response is OK
 *
 **/

function submitTaskForm(taskId, submission_key, submission_value, rest_url, submit_type) {
  var headers = new Headers();
  headers.append("Content-Type","application/json");
  if (configuration["camundaHeaderAuth"] != "") headers.append(configuration["camundaHeaderAuth"], configuration["camundaHeaderDigest"]);

  if (!submit_type)  submit_type="complete"; // Default parameter for compatibility with IE / Edge
  var payload = {};
  payload["variables"] = {};
  payload["variables"][submission_key] = {};
  payload["variables"][submission_key]["value"] = submission_value;
//  payload["variables"][submission_key]["type"]  = submission_type;

  return fetch(rest_url + '/' + 'task' + '/' + taskId + '/' + submit_type, { headers : headers,
                method: 'POST',
                body: JSON.stringify(payload)
              }).then(function(response) {
                if ((response.status === 500)||(response.status === 400))
                   return response.text()  // Error -- html or json
                if (response.status === 204) return response;        // All OK
              }).then(function(response){
                if (typeof response == "string") {
                    try {
                      var body = JSON.parse(response);
                      if (body.type === 'RestException') {
                        var message = body.message;
                      }
                    }
                    catch (err) {
                       var message = jQuery(response).text();
                    }
                    finally {
                       throw new Error(message);
                    }
               } else return response;
              });
};

/**
 * Retrieves JSON representation of the form
 *
 * @param  {string} form_json_url   - JSON file name
 * @return {Object}                 - Response JSON representation of the form
 *
 **/

function getFormURL(form_json_url) {
// Check if it is a local file or an actual url and treat differently
    if (form_json_url.startsWith("http")) {
      furl = form_json_url;
    } else {
      furl = "./assets/jsons/" + form_json_url;
    };
  return furl;
};

/**
 * Retrieves data structure to prepopulate Formio form
 *
 * @param  {string} injection              - content of the BPMN formio_form_injection
 * @param  {string} flattened_components   - list of flattened components of the form
 * @return {Object}                        - Sumbission data structure
 *
 **/

function getFormInjection(injection, flattened_components) {
    var inj = {"data": {} };
    for (var key in injection) {
      // Set values only for existing components
      if (key in flattened_components) inj["data"][key] = injection[key];
    };
    return inj;
};
