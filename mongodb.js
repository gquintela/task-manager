const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;

const conectionUrl = "mongodb://127.0.0.1:27017"; //using full ip since localhost had issues
const databaseName = "task-manager";

mongoClient.connect(
  conectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName); ///new database created

    db.collection("users").insertOne({
      name: "Gonzalo",
      age: "30"
    });
  }
);
