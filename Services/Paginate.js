const HttpError = require("../Errors/HttpError");

class Paginataion{

    static make(dataToPaginate, page, perPage)
    {
        page = this.validate(dataToPaginate, page);
        let startIndex = perPage * page;
        let data = dataToPaginate.filter((element, index) =>{
            if(index >= startIndex && perPage !== 0){
                perPage--;
                return element;
            }
        })
        if(data.length === 0){
            throw new HttpError({
                "status": 404,
                "message": "There is not such a page",
            });
        }
        return data;
    }

    static validate(data, page)
    {
        if(data.length === 0){
            throw new HttpError({
                "status": 404,
                "message": "There is not data for that term"
            })
        }
        if(!page){
            page = 0;
        } else if(page > 0){
            page = parseInt(page) - 1;
        }
        else {
            throw new HttpError({
                "status": 404,
                "message": "There is not such a page",
            })
        }
        return page;
    }

}

module.exports = Paginataion;