class Car
{
    static ratings = this.calculateRating();
    static all()
    {
        // return all cars
        // add property is car available or not
        // add average rating
        // add property when car will be returned
        let allCars = JSON.parse(this.#readCars());
        let rentedCars = JSON.parse(this.#readRentedCars());
        let rentedCarsLicense = rentedCars.map(car => car.license);
        return allCars.map((car, index)=>{
            car.available = true;
            car.averageRating = this.getAverageRating(car.license);
            if(rentedCarsLicense.includes(car.license)){
                car.available = false;
                car.returnDate = rentedCars[rentedCarsLicense.indexOf(car.license)].returnDate;
            }
            return car;
        })
    }

    static rented()
    {
        // check is rented cars empty
        let rentedCars = JSON.parse(this.#readRentedCars());
        if(rentedCars.length === 0) return [];

        // return all rentedCars
        let allCars = JSON.parse(this.#readCars());
        return rentedCars.map(rentedCar => {
            let car = allCars.find(car => car.license === rentedCar.license);
            return {
                "license": car.license,
                "pricePerDay": rentedCar.pricePerDay,
                "startDate": rentedCar.startDate,
                "returnDate": rentedCar.returnDate,
                "personalData": rentedCar.personalData,
                "idCard": rentedCar.idCard,
                "phoneNumber": rentedCar.phoneNumber,
            }
        });
    }

    static historyRented()
    {
        return JSON.parse(this.#readStats());
    }

    static find(id, license)
    {
        // search for id or license
        let allCars = JSON.parse(this.#readCars());
        if(id){
            return allCars.find((car)=>{
                return car.id === parseInt(id);
            })
        }
        else if(license){
            return allCars.find((car)=>{
                return car.license === license;
            })
        }
        return null;
    }

    static findRented(id, license)
    {
        // search for id or license
        let rentedCars = JSON.parse(this.#readRentedCars());
        if(id){
            return rentedCars.find((car)=>{
                return car.id === parseInt(id);
            })
        }
        else if(license){
            return rentedCars.find((car)=>{
                return car.license === license;
            })
        }
        return null;
    }


    static getAverageRating(license){
        if(this.ratings[license]){
            return this.ratings[license].totalRating / this.ratings[license].numberOfRatings;
        }
        return 0;
    }

    static calculateRating(){
        let data = [];
        let statistics = JSON.parse(this.#readStats());

        for(let i = 0; i<statistics.length; i++){
            data[statistics[i].license] = {
                totalRating: data[statistics[i].license] !== undefined ?
                    data[statistics[i].license].totalRating + statistics[i].userRating : 
                    statistics[i].userRating,
                numberOfRatings: data[statistics[i].license] !== undefined ? 
                    ++data[statistics[i].license].numberOfRatings : 1
            }
        }
        return data;
    }

    static bestSelling(numberOfCars){
        let statistics = JSON.parse(this.#readStats());
        let carsCounts = [];
        let mostSellingCars = [];

        statistics.forEach(statData => {
            if (!carsCounts[statData.license]) {
                carsCounts[statData.license] = { 
                    license: statData.license, 
                    numberOfRented: 0 
                };
            }
            carsCounts[statData.license].numberOfRented++;
        });

        let sortedCars = Object.values(carsCounts).sort((a, b) => b.numberOfRented - a.numberOfRented);
        for(let i = 0; i<numberOfCars; i++){
            mostSellingCars.push(this.find(null, sortedCars[i].license));
        }
        return mostSellingCars;
    }  

    static update(newCar)
    {
        let allCars = JSON.parse(this.#readCars());
        this.#writeCars(
            allCars.map(car =>{
                if(car.id === newCar.id){
                    car = newCar;
                }
                return car;
            })
        );
    }

    static updateRent(data)
    {

        let rentedCars = JSON.parse(this.#readRentedCars());
        this.#writeRentedCars(
            rentedCars.map(car => {
                if(data.license === car.license){
                    car.personalData = data.personalData;
                    car.idCard = data.idCard;
                    car.returnDate = data.returnDate;
                    car.phoneNumber = data.phoneNumber;
                }
                return car;
            })
        )

    }

    static deleteRented(license)
    {
        let rentedCars = JSON.parse(this.#readRentedCars());
        this.#writeRentedCars(
            rentedCars.filter(car =>{
                return car.license !== license;
            })
        );
    }

    static rent(rentedCarData)
    {
        // add a car id into rented cars
        let rentedCars = JSON.parse(this.#readRentedCars());
        rentedCars.push({
            license: rentedCarData.license,
            startDate: rentedCarData.startDate,
            returnDate: rentedCarData.returnDate,
            pricePerDay: rentedCarData.pricePerDay,
            phoneNumber: rentedCarData.number,
            idCard: rentedCarData.idCard,
            personalData: rentedCarData.personalData,
        });
        this.#writeRentedCars(rentedCars);
    }

    static store(carInfo)
    {
        let allCars = JSON.parse(this.#readCars());
        allCars.push(carInfo);
        this.#writeCars(allCars);
    }

    static insertStat(stat)
    {
        let allStatistics = JSON.parse(this.#readStats());
        allStatistics.push(stat);
        this.#writeStats(allStatistics);
        this.calculateRating();
    }

    static destroy(license)
    {
        let allCars = JSON.parse(this.#readCars());
        this.#writeCars(
            allCars.filter(car =>{
                return car.license !== license;
            })
        );
    }

    static isRented(license)
    {
        // check is car rented or not 
        let rentedCars = JSON.parse(this.#readRentedCars());
        for(let i = 0; i<rentedCars.length; i++){
            if(rentedCars[i].license === license){
                return true;
            }
        }
        return false;
    }

    static #readCars()
    {
        const fs = require("fs");
        return fs.readFileSync("database/cars.json", "utf-8");
    }

    static #readRentedCars()
    {
        const fs = require("fs");
        return fs.readFileSync("database/rentedCars.json", "utf-8");
    }

    static #readStats()
    {
        const fs = require("fs");
        return fs.readFileSync("database/stats.json", "utf-8");
    }

    static #writeCars(cars)
    {
        const fs = require("fs");
        fs.writeFileSync("database/cars.json", JSON.stringify(cars))
    }

    static #writeRentedCars(rentedCars)
    {
        const fs = require("fs");
        fs.writeFileSync("database/rentedCars.json", JSON.stringify(rentedCars))
    }

    static #writeStats(statistics)
    {
        const fs = require("fs");
        fs.writeFileSync("database/stats.json", JSON.stringify(statistics))
    }
}

module.exports = Car;