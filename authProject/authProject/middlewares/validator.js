const Joi = require('joi');

exports.signupSchema = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    password: Joi.string().required().pattern(/^[A-Za-z0-9]{4,}$/),
    name:Joi.string().required().min(3).max(15)

})


exports.signinSchema = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    password: Joi.string().required().pattern(/^[A-Za-z0-9]{4,}$/),
    

})

exports.acceptCodeSchema = Joi.object({
    email:Joi.string().min(6).max(60).required().email({
        tlds:{allow:['com','net']}
    }),
    providedCode:Joi.number().required()
})


exports.changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .required()
        .pattern(/^[A-Za-z0-9]{4,}$/)
        .messages({
            "string.empty": "Old password is required",
            "string.pattern.base": "Old password must be at least 4 characters and contain only letters and numbers",
        }),

    newPassword: Joi.string()
        .required()
        .pattern(/^[A-Za-z0-9]{4,}$/)
        .messages({
            "string.empty": "New password is required",
            "string.pattern.base": "New password must be at least 4 characters and contain only letters and numbers",
        }),
});

exports.acceptFPCodeSchema = Joi.object({
    email: Joi.string().min(6).max(60).required().email({
        tlds: { allow: ['com', 'net'] }
    }),
    providedCode: Joi.number().required().messages({
        "string.empty": "Verification code is required", // رسالة إذا كانت الحقول فارغة
    }),
    newPassword: Joi.string()
        .required()
        .pattern(/^[A-Za-z0-9]{4,}$/)
        .messages({
            "string.empty": "New password is required",
            "string.pattern.base": "New password must be at least 4 characters and contain only letters and numbers",
        }),
});
