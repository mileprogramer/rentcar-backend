const CarModel = require("../models/CarModel");
const Joi = require("joi");

class CarValidation
{

    static async rent(req, res, next)
    {
        try {
            if(CarModel.isRented(req.body.license) === true){
                throw new Error("This car is rented");
            }
            if(new Date(req.body.returnDate).getTime() - new Date(req.body.startDate).getTime() < 0){
                throw new Error("Return date must be after start date");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }

        const schema = Joi.object({
            personalData: Joi.string().min(6).required().messages({
                'string.base': 'First name and last name should be a type of text',
                'string.min': 'First name and last name should have a minimum length of {#limit}',
                'any.required': 'First name and last name is required'
            }),
            idCard: Joi.number().required().messages({
                'number.base': 'ID card should be a type of number',
                'any.required': 'ID card is required'
            }),
            pricePerDay: Joi.number().required().messages({
                'number.base': 'Price per day should be a type of number',
                'any.required': 'Price per day is required'
            }),
            startDate: Joi.date().required().messages({
                'date.base': 'Start date should be a valid date',
                'any.required': 'Start date is required'
            }),
            returnDate: Joi.date().required().messages({
                'date.base': 'Return date should be a valid date',
                'any.required': 'Return date is required'
            }),
            number: Joi.number().required().messages({
                'number.base': 'Number should be a type of number',
                'any.required': 'Number is required'
            }),
            license: Joi.string().min(6).required().messages({
                'string.base': 'License should be a type of text',
                'string.min': 'License should have a minimum length of {#limit}',
                'any.required': 'License is required'
            }),
        });
        const { error } = schema.validate(req.body, {abortEarly: false});
        if(!error){
            return next();
        }
        return res.status(400).json(error.details.map(error => error.message));
    }

    static async updateRent(req, res, next){
        try {
            if(CarModel.isRented(req.body.license) === false){
                throw new Error("This car is not rented");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }

        const schema = Joi.object({
            license: Joi.string().min(6).required().messages({
                'string.base': 'License should be a type of text',
                'string.min': 'License should have a minimum length of {#limit}',
                'any.required': 'License is required'
            }),
            personalData: Joi.string().min(6).required().messages({
                'string.base': 'First name and last name should be a type of text',
                'string.min': 'First name and last name should have a minimum length of {#limit}',
                'any.required': 'First name and last name is required'
            }),
            idCard: Joi.number().required().messages({
                'number.base': 'ID card should be a type of number',
                'any.required': 'ID card is required'
            }),
            returnDate: Joi.date().required().messages({
                'date.base': 'Return date should be a valid date',
                'any.required': 'Return date is required'
            }),
            phoneNumber: Joi.number().required().messages({
                'number.base': 'Number should be a type of number',
                'any.required': 'Number is required'
            })
        });
        const { error } = schema.validate(req.body, {abortEarly: false});
        if(!error){
            return next();
        }
        return res.status(400).json(error.details.map(error => error.message));
    }

    static async accept(req, res, next){
        try {
            var car = CarModel.findRented(null, req.body.license)
            if(!car){
                throw new Error("This car is not rented");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }

        const schema = Joi.object({
            userRating: Joi.number().required().messages({
                'number.base': 'User rating should be a type of number',
                'any.required': 'User rating is required'
            }),
            review: Joi.string().min(6).required().messages({
                'string.base': 'Review should be a type of text',
                'string.min': 'Review should have a minimum length of {#limit}',
                'any.required': 'Review is required'
            }),
            license: Joi.string().min(6).required().messages({
                'string.base': 'License should be a type of text',
                'string.min': 'License should have a minimum length of {#limit}',
                'any.required': 'License is required'
            }),
        });
        const { error } = schema.validate(req.body, {abortEarly: false});
        if(!error){
            req.car = {...car, userRating:req.body.userRating, review: req.body.review};
            return next();
        }
        return res.status(400).json(error.details.map(error => error.message));
    }

    static async store(req, res, next){
        try {
            if(CarModel.find(null, req.body.license)){
                throw new Error("License is already taken");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }

        const schema = Joi.object({
            license: Joi.string().min(4).required().messages({
                'string.base': 'License should be a type of text',
                'string.min': 'License should have a minimum length of {#limit}',
                'any.required': 'License name is required'
            }),
            brand: Joi.string().min(3).required().messages({
                'string.base': 'Brand should be a type of text',
                'string.min': 'Brand should have a minimum length of {#limit}',
                'any.required': 'Brand name is required'
            }),
            model: Joi.string().min(2).required().messages({
                'string.base': 'Model should be a type of text',
                'string.min': 'Model should have a minimum length of {#limit}',
                'any.required': 'Model name is required'
            }),
            airConditioner: Joi.bool().required().messages({
                'date.base': 'Air conditioner should be a valid true or false',
                'any.required': 'Return date is required'
            }),
            year: Joi.number().required().messages({
                'number.base': 'Year should be a type of number',
                'any.required': 'Year is required'
            }),
            pricePerDay: Joi.number().required().messages({
                'number.base': "Price id must be number",
                'any.required': "Price id is required"
            })
        });
        const { error } = schema.validate(req.body, {abortEarly: false});
        if(!error){
            return next();
        }
        return res.status(400).json(error.details.map(error => error.message));
    }

    static async update(req, res, next){
        try {

            if(!CarModel.find(null, req.body.license)){
                throw new Error("There is not car with these license");
            }
            // to do correct these into check is license !== newLicense
            if(!req.body.license === req.body.newLicense && CarModel.find(null, req.body.newLicense)){
                throw new Error("New License is already taken");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }

        const schema = Joi.object({
            license: Joi.string().min(4).required().messages({
                'string.base': 'License should be a type of text',
                'string.min': 'License should have a minimum length of {#limit}',
                'any.required': 'License name is required'
            }),
            id: Joi.number().required().messages({
                'number.base': 'Id should be a type of number',
                'any.required': 'Id is required'
            }),
            brand: Joi.string().min(3).required().messages({
                'string.base': 'Brand should be a type of text',
                'string.min': 'Brand should have a minimum length of {#limit}',
                'any.required': 'Brand name is required'
            }),
            model: Joi.string().min(2).required().messages({
                'string.base': 'Model should be a type of text',
                'string.min': 'Model should have a minimum length of {#limit}',
                'any.required': 'Model name is required'
            }),
            airConditioner: Joi.bool().required().messages({
                'date.base': 'Air conditioner should be a valid true or false',
                'any.required': 'Return date is required'
            }),
            year: Joi.number().required().messages({
                'number.base': 'Year should be a type of number',
                'any.required': 'Year is required'
            }),
            pricePerDay: Joi.number().required().messages({
                'number.base': "Price id must be number",
                'any.required': "Price id is required"
            })
        });
        let car = {
            id: req.body.id,
            license : req.body.newLicense || req.body.license,
            brand : req.body.brand,
            model : req.body.model,
            airConditioner : req.body.airConditioner,
            year : req.body.year,
            pricePerDay : req.body.pricePerDay,
        }
        const { error } = schema.validate(car, {abortEarly: false});
        if(!error){
            req.car = car;
            return next();
        }
        return res.status(400).json(error.details.map(error => {return {"message": error.message}}));
    }

    static async destroy(req, res, next){
        console.log(req.body);
        try {

            if(!CarModel.find(null, req.body.license)){
                throw new Error("There is not car with these license");
            }
        } catch (error) {
            return res.status(400).json([{"message":error.message}]);
        }
        req.carLicense = req.body.license;
        return next();
    }

}

module.exports = CarValidation;