const { MongoClient, ObjectID } = require("mongodb"); ///destructuring mongo db properties

const conectionUrl = "mongodb://127.0.0.1:27017"; //using full ip since localhost had issues
const databaseName = "task-manager";

const id = new ObjectID();

///connect to mongo db
MongoClient.connect(
  conectionUrl,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName); ///establishing database, if not -> new database created

    db.collection("users")
      .deleteMany({ age: 2008 })
      .then(result => {
        console.log(result, "todo ok");
      })
      .catch(error => {
        console.log("error ameo");
      });

    // db.collection("tasks")
    //   .updateOne(
    //     { _id: new ObjectID("5e8275f5941e770de03557b9") },
    //     { $set: { description: "caca" } }
    //   )
    //   .then(result => {
    //     console.log(result.modifiedCount);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }
);

//// insert many
// db.collection("tasks").insertMany(
//   [
//     { description: "running", completed: false },
//     { description: "playing guitar", completed: false }
//   ],
//   (error, result) => {
//     if (error) {
//       console.log(error);
//       console.log("unable to insert tasks!");
//     } else {
//       console.log(result.ops);
//     }
//   }
// );

// ///findOne
// db.collection("tasks").findOne(
//   { description: "running", completed: false },
//   (error, user) => {
//     if (error) {
//       console.log("unable to fetch data");
//       // console.log(error);
//     } else {
//       console.log(user);
//     }
//   }
// );
