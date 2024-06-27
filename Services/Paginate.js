const HttpError = require("../Errors/HttpError");
const DB = require("../database/DB");

class Paginataion{

    static async make(collection, page, perPage)
    {
        try{
            page = this.validatePage(page);
        }
        catch (error){
            return error;
        }
        try{
            let dataToPaginate = [];
            let totalDataToPaginate = 0;
            let startNumber = (page - 1) * perPage;
            let endNumber = startNumber + perPage;
            console.log(startNumber, endNumber);
            [dataToPaginate, totalDataToPaginate] = await Promise.all([
                DB.get(collection, startNumber, endNumber),
                DB.getTotal(collection)
            ]);
            if(dataToPaginate.length === 0){
                throw new HttpError({
                    "status": 404,
                    "message": "This page does not exists"
                })
            }
            return {dataToPaginate, totalDataToPaginate};
        }catch (httpError){
            console.log("Error in pagination make on collection", collection);
            console.log(httpError);
            return httpError;
        }
    }
    static validatePage(page)
    {
        page = parseInt(page);
        if(!page){
            page = 1;
        } else if(page > 0){
            return page;
        }
        else {
            throw new HttpError({
                "status": 404,
                "message": "There is not such a page",
            })
        }
    }

}

module.exports = Paginataion;