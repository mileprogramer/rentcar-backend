const HttpError = require("../Errors/HttpError");
const DB = require("../database/DB");
const CarModel = require("../models/CarModel")
class Paginataion{

    static async make({modelToCall, getTotal, collection, page, perPage})
    {
        // check is user provided right page
        page = parseInt(page);
        if(!page){
            throw new HttpError({
                status: 404,
                message: "There is not such a page"
            });
        }

        let dataToPaginate = [];
        let totalDataToPaginate = 0;
        let startNumber = (page - 1) * perPage;
        let endNumber = startNumber + perPage;

        try{
            [dataToPaginate, totalDataToPaginate] = await Promise.all([
                modelToCall(collection, startNumber, endNumber),
                getTotal(collection)
            ]);
        }
        catch (httpError){
            console.log("Error in pagination make on collection", collection);
            console.log(httpError);
            throw httpError;
        }

        if(dataToPaginate.length === 0){
            throw new HttpError({
                "status": 404,
                "message": "This page does not exists"
            })
        }

        return {dataToPaginate, totalDataToPaginate};
    }
}

module.exports = Paginataion;