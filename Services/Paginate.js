class Paginataion{

    static make(dataToPaginate, page, perPage)
    {
        let startIndex = perPage * page;
        return dataToPaginate.filter((element, index) =>{
            if(index >= startIndex && perPage !== 0){
                perPage--;
                return element;
            }
        })
    }


}

module.exports = Paginataion;