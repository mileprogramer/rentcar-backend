const CarModel = require("../models/CarModel");
const Pagination = require("../Services/Paginate");
class CarController {

    static async index(req, res) {
        // getAllCars
        // from res.params take a number of page
        // per page return 10
        try{
            let carPerPage = 10;
            let allCars = CarModel.all();
            let totalCars = allCars.length;
            allCars = Pagination.make(allCars, req.query.page, carPerPage);

            return res.json({
                paginateData: {
                    "totalCars": totalCars,
                    "carsPerPage": carPerPage,
                },
                cars: allCars,
            })
        }catch (error){
            console.log(error);
            res.status(error.status).json([{"message":error.message}])
        }
    }

    static async show(req, res) {
        let carId = parseInt(req.params.identifier);
        let carLicense = null;
        (req.params.identifier instanceof Number) ?
            carId = req.params.identifier : carLicense = req.params.identifier;
        let car = CarModel.find(carId, carLicense);
        if (car) return res.end(JSON.stringify(CarModel.find(carId, carLicense)));
        return res.status(404).end(`Not such a car with ${carId || carLicense}`)
    }

    static async rented(req, res) {
        // getAll cars that are rented
        res.json(CarModel.rented());
    }

    static async historyRented(req, res){
        // show all cars that were rented and returned // statistics
        try{
            let carPerPage = 10;
            let rentedCars = CarModel.historyRented();
            let totalCars = rentedCars.length;
            rentedCars = Pagination.make(rentedCars, req.query.page, carPerPage);

            return res.json({
                paginateData: {
                    "totalCars": totalCars,
                    "carsPerPage": carPerPage,
                },
                cars: rentedCars,
            })
        }catch (error){
            console.log(error);
            res.status(error.status).json([{"message":error.message}])
        }
    }

    static async search(req, res){
        let allCars = CarModel.all();
        let data = allCars.filter(car =>{
            if(car.model.includes(req.params.identifier) ||
                car.brand.includes(req.params.identifier))
                return car;
        })
        try{
            let carsPagination = Pagination.make(data, req.query.page, 10)
            return res.json({
                paginateData: {
                    "totalCars": data.length,
                    "carsPerPage": 10,
                },
                cars: carsPagination,
            })
        }
        catch (error){
            console.log(error);
            return res.status(error.status).json(error.message);
        }
    }

    static async searchRented(req, res){
        let rentedCars = CarModel.rented();
        return res.json(rentedCars.filter(car =>{
            if(car.personalData.includes(req.params.identifier) || 
                car.license.includes(req.params.identifier) ||
                car.idCard.includes(req.params.identifier)
            ) 
            return car;
        }));
    }

    static searchHistoryRented(req, res){
        let statisticts = CarModel.historyRented();
        let startDate = new Date(req.params.startDate).getTime();
        let endDate = new Date(req.params.endDate).getTime()
        let license = req.params.license;

        let statistictsData = statisticts.filter(rentedData =>{
            if(rentedData.license !== license) return ;
            let carStartDate = new Date(rentedData.startDate).getTime();
            let carRentedDate = new Date(rentedData.returnDate).getTime();
            return (carStartDate >=  startDate && 
                    carRentedDate <= endDate)
        });

        try{
            let dataPagination = Pagination.make(statistictsData, req.query.page, 10);
            return res.json({
                paginateData: {
                    "totalCars": dataPagination.length,
                    "carsPerPage": 10,
                },
                cars: dataPagination,
            })
        }catch (paginateError){
            console.log(paginateError);
            res.status(paginateError.status).json({"message":paginateError.message});
        }

    }

    static async sort(req, res) {
        let whatToSort = [
            "reset",
            "pricePerDay",
            "model"
        ]
        if(req.query.reset){
            return res.json(CarModel.all());
        }

        let sortCriteria = [];
        let sortOrders = [];

        try {
            // Iterate over query parameters to build sort criteria and orders
            for (let queryParam in req.query) {
                let [criterium, order] = req.query[queryParam].split(":");
                if (!whatToSort.includes(criterium)) {
                    throw new Error(`We do not have implemented sort by ${criterium}`);
                }
                if (!['asc', 'desc'].includes(order)) {
                    throw new Error(`Invalid sort order for ${criterium}. Must be 'asc' or 'desc'`);
                }
                sortCriteria.push(criterium);
                sortOrders.push(order);
            }
        } catch (error) {
            return res.status(400).json({ "message": error.message });
        }

        let allCars = CarModel.all();

        // Function to compare two items based on multiple criteria
        function compare(a, b, criteria, orders) {
            for (let i = 0; i < criteria.length; i++) {
                if (a[criteria[i]] > b[criteria[i]]) {
                    return orders[i] === 'asc' ? 1 : -1;
                }
                if (a[criteria[i]] < b[criteria[i]]) {
                    return orders[i] === 'asc' ? -1 : 1;
                }
            }
            return 0;
        }

        let sortedCars = allCars.sort((a, b) => compare(a, b, sortCriteria, sortOrders));
        return res.json(sortedCars);
    }

    static bestSelling(req, res){
        let numberOfCars = req.params.numberOfCars;
        return res.json(CarModel.bestSelling(numberOfCars));
    }

    // PATCH CONTROLLERS
    static async update(req, res) {
        CarModel.update(req.car);
        res.json({"message":"Succesfully edit car"});
    }

    static async updateRent(req, res){
        CarModel.updateRent(req.body);
        res.json({"message":"Succesfully edit rented data"});
    }

    // POST CONTROLLERS
    static async store(req, res) {
        // first validate middleware CarValidation.store
        // call CarModel and insert value in cars.json
        CarModel.store({...req.body, id: CarController.generateIdCar()});
        res.json([{"message":"Succesfully added car"}]);
    }

    static async accept(req, res) {
        let today = new Date();

        function todayDate(){
            let month = new Date().getMonth() + 1;
            return new Date().getFullYear() + "-" + month + "-"+ new Date().getDate()
        }

        const calculateTotalPrice = (startDate, returnDate, pricePerDay) =>{
            let mSeconds = returnDate.getTime() - new Date(startDate).getTime();
            let days = mSeconds / (1000 * 60 * 60 * 24);
            return days * pricePerDay;
        }

        let stat = {
            "license": req.car.license,
            "startDate": req.car.startDate,
            "returnDate": todayDate(),
            "pricePerDay": req.car.pricePerDay,
            "totalPrice": calculateTotalPrice(req.car.startDate, today, req.car.pricePerDay),
            "idCard": req.car.idCard,
            "personalData": req.car.personalData,
            "phoneNumber": req.car.phoneNumber,
            "review": req.car.review,
            "userRating": req.car.userRating,
        }
        
        CarModel.insertStat(stat);
        CarModel.deleteRented(req.car.license);
        return res.json({"message": "Succesfully returned car"});
    }

    static async rent(req, res) {
        // validation is done 
        // call CarModel insert value of id in rentedCar
        CarModel.rent(req.body);
        res.json({ "message": "Successfully rented car" });
    }

    static async destroy(req, res) {
        CarModel.destroy(req.carLicense);
        res.json([{"message":"Succesfully deleted car"}]);
    }

    static generateIdCar()
    {
        let maxId = 0;
        CarModel.all().map((car)=>{
            if(car.id > maxId)
                maxId = car.id;
        });
        return ++maxId;
    }
}

module.exports = CarController;