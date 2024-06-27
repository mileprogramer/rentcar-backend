const { MongoClient } = require('mongodb');
class DB
{
    static database;
    static async connect(url){
        const client = new MongoClient(url);
        await client.connect();
        this.database = client.db("rentcar");
    }

    static async get(nameCollection, startNumber = 0, endNumber = 10){
        try{
            let collection = this.database.collection(nameCollection);
            return collection.find().skip(startNumber).limit(endNumber - startNumber).toArray()
        }catch (error){
            console.log("Failed fetching data in get method with collection ",nameCollection);
            console.log(error);
            return null;
        }
    }

    static async getTotal(nameCollection)
    {
        try{
            let collection = this.database.collection(nameCollection);
            return await collection.countDocuments();
        }
        catch (error){
            console.log("Failed fetching number of total elements in collection ",nameCollection);
            console.log(error);
            return null;
        }
    }

}

module.exports = DB;