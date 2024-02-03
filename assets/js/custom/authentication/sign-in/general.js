"use strict";

// Class definition
var KTSigninGeneral = function () {
    // Elements
    var form;
    var submitButton;
    var validator;

    // Handle form
    var handleValidation = async  function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
			form,
			{
				fields: {					
					'email': {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: await __('The value is not a valid email address'),
                            },
							notEmpty: {
								message: await  __('Email address is required')
							}
						}
					},
                    'password': {
                        validators: {
                            notEmpty: {
                                message: await __('The password is required')
                            }
                        }
                    } 
				},
				plugins: {
					trigger: new FormValidation.plugins.Trigger(),
					bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',  // comment to enable invalid state icons
                        eleValidClass: '' // comment to enable valid state icons
                    })
				}
			}
		);	
    }

    var handleSubmitDemo = function(e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(async function (status) {
                if (status == 'Valid') {
                    // Show loading indication
                    submitButton.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click 
                    submitButton.disabled = true;
                    

                    // Simulate ajax request
                    setTimeout(async function() {
                        // Hide loading indication
                        submitButton.removeAttribute('data-kt-indicator');

                        // Enable button
                        submitButton.disabled = false;

                        // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                        Swal.fire({
                            text: await __("You have successfully logged in!"),
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: await __("Ok, got it!"),
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        }).then(function (result) {
                            if (result.isConfirmed) { 
                                form.querySelector('[name="email"]').value= "";
                                form.querySelector('[name="password"]').value= "";  
                                                              
                                //form.submit(); // submit form
                                var redirectUrl = form.getAttribute('data-kt-redirect-url');
                                if (redirectUrl) {
                                    location.href = redirectUrl;
                                }
                            }
                        });
                    }, 2000);   						
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: await __("Sorry, looks like there are some errors detected, please try again."),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: await __("Ok, got it!"),
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
		});
    }

    var handleSubmitAjax = async function(e) {
        // Handle form submit
        submitButton.addEventListener('click', function (e) {
            // Prevent button default action
            e.preventDefault();

            // Validate form
            validator.validate().then(async function (status) {
                if (status == 'Valid') {
                    // Hide loading indication
                    submitButton.removeAttribute('data-kt-indicator');

                    // Enable button
                    submitButton.disabled = false;
                                        
                    // Check axios library docs: https://axios-http.com/docs/intro 
                    axios.post('/your/ajax/login/url', {
                        email: form.querySelector('[name="email"]').value, 
                        password: form.querySelector('[name="password"]').value 
                    }).then(async function (response) {
                        if (response) {
                            form.querySelector('[name="email"]').value= "";
                            form.querySelector('[name="password"]').value= "";  

                            const redirectUrl = form.getAttribute('data-kt-redirect-url');
                            
                            if (redirectUrl) {
                                location.href = redirectUrl;
                            }
                        } else {
                            // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                            Swal.fire({
                                text: await __("Sorry, the email or password is incorrect, please try again."),
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: await __("Ok, got it!"),
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                        }
                    }).catch(async function (error) {
                        Swal.fire({
                            text: await __("Sorry, looks like there are some errors detected, please try again."),
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: await __("Ok, got it!"),
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                    });
                } else {
                    // Show error popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                    Swal.fire({
                        text: await __("Sorry, looks like there are some errors detected, please try again."),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: await __("Ok, got it!"),
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }
            });
		});
    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#kt_sign_in_form');
            submitButton = document.querySelector('#kt_sign_in_submit');
            
            handleValidation();
            handleSubmitDemo(); // used for demo purposes only, if you use the below ajax version you can uncomment this one
            //handleSubmitAjax(); // use for ajax submit
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTSigninGeneral.init();
});
