// DOM
const contactForm = document.querySelector(".c-contact__form");

const fields = {
    firstName: {
        input: document.getElementById("first-name"),
        errors: {
            required: document.getElementById("first-name-error")
        },
        validateOn: "blur",
        touched: false,
    },
    lastName: {
        input: document.getElementById("last-name"),
        errors: {
            required: document.getElementById("last-name-error")
        },
        validateOn: "blur",
        touched: false,
    },
    email: {
        input: document.getElementById("email"),
        errors: {
            required: document.getElementById("email-required-error"),
            format: document.getElementById("email-format-error")
        },
        validateOn: "blur",
        touched: false,
    },
    queryOption: {
        input: document.getElementById("general-enquiry"),
        controls: contactForm.querySelectorAll('input[name="query"]'),
        errors: {
            required: document.getElementById("query-error"),
        },
        container: contactForm.querySelectorAll(".c-contact__option"),
        validateOn: "change",
    },
    message: {
        input: document.getElementById("message"),
        errors: {
            required: document.getElementById("message-error"),
        },
        validateOn: "blur",
        touched: false,
    },
    contactConsent: {
        input: document.getElementById("contact-consent"),
        errors: {
            required: document.getElementById("contact-consent-error"),
        },
        validateOn: "change",
    },
}

const successToast = {
    container: document.querySelector(".c-contact__success"),
    title: document.querySelector(".c-contact__success-heading"),
    message: document.querySelector(".c-contact__success-text")
}

// EVENT LISTENERS
Object.values(fields).forEach(field => {
    if ("touched" in field) {
    // Ignore synthetic focus events triggered by Chromium autofill.
    // Only mark the field as touched when it actually becomes the active element.
    field.input.addEventListener("focus", () => {
        if (document.activeElement !== field.input) return;
            
        field.touched = true;
        });
    }

    if (field.controls){
        field.controls.forEach(control => control.addEventListener(field.validateOn, () => validateField(field)));
    } else{
            field.input.addEventListener(field.validateOn, () => {
                if (!field.touched) return;
                validateField(field);
            })
    }
})

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const result = validateForm();

    if (!result.valid){
        result.firstInvalidInput.focus();
        return
    }

    contactForm.reset();
    showSuccessMessage();
})

// VALIDATION
function validateField(field) {
    clearFieldError(field);

    if(field.input.validity.valueMissing){
        field.errors.required.hidden = false;

        if(field.container){
            field.container.forEach(option => option.classList.add("is-error"));
            field.controls.forEach(control => {
                control.setAttribute("aria-invalid", "true")
                control.setAttribute("aria-describedby", field.errors.required.id)
            })
        }else {
            field.input.classList.add("is-error");
            field.input.setAttribute("aria-invalid", "true");
            field.input.setAttribute("aria-describedby", field.errors.required.id)
        }
        return false;
    }
    
    if(field.input.validity.patternMismatch){
        field.errors.format.hidden = false;
        field.input.classList.add("is-error");
        field.input.setAttribute("aria-invalid", "true");
        field.input.setAttribute("aria-describedby", field.errors.format.id)
        return false;
    }

    return true;
}

function validateForm(){
    let valid = true;
    let firstInvalidInput = null;
    
    Object.values(fields).forEach(field => {

        if(!validateField(field)){
            valid = false;

            if(!firstInvalidInput){
                firstInvalidInput = field.input;
            }
        }
    })
    
    return { valid, firstInvalidInput };
}

// UI HELPERS
function clearFieldError(field){
    if(field.container){
        field.container.forEach(option => option.classList.remove("is-error"));
        field.controls.forEach(control => {
            control.removeAttribute("aria-invalid");
            control.removeAttribute("aria-describedby")
        })
    }else {
        field.input.classList.remove("is-error");
        field.input.removeAttribute("aria-invalid");
        field.input.removeAttribute("aria-describedby");
    }
    Object.values(field.errors).forEach(error => error.hidden = true);
}


function showSuccessMessage(){
    successToast.container.classList.add('is-visible');
    
    successToast.title.innerHTML = "Message Sent!";
    successToast.message.textContent =
    "Thanks for completing the form. We'll be in touch soon!";
}