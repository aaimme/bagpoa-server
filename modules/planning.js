"use strict";
var assert = require('assert');
let mongo = require('mongodb').MongoClient;
let connection = 'mongodb://localhost:27017/bagpaotravel';
var isodate = require("isodate");
var date;
// Write current date as ISO 8601 string.
date = new Date();

		exports.end = function(req) {
						console.log(req.body.place);
						mongo.connect(connection, (error, database) => {
						database
						.collection('trip')
						.insert([{
                name:`${req.body.name}`,
    						creator:`${req.body.username}`,
                origin:`${req.body.origin}`,
                destination:`${req.body.destination}`,
							  daytrip:`${req.body.daytrip}`,
		//						picture:`${req.body.picture}`,
								place :`${req.body.place}`,
		//					time :`${req.body.time}`,
                privacy:`${req.body.privacy}`,
							  status:`active`,
								like: 0,
								share: 0,
                datesubmit: date
                }]);

								database.collection('trip').find({ name:`${req.body.name}`}).toArray(function(err, docs) {
									if (err) {
										console.log('error:', err);
							  	}else{
							  		if (docs.length == 1) {
							  			  var idtrip = docs[0]._id ;
											database.collection('member').update({ username: `${req.body.username}`},
						         {
						           $push: {
						                mytrip: {
						                $each: [ {
															$ref : "trip",
			                				$id : idtrip,
			                				$db : "bagpaotravel"
														 }]
						             }
						           }
						         }
						        );
							  	}else{
							  			console.log('no update');
							  		}
							  	}
								});
								});
						console.log('create trip success');
		}

		exports.transportation = function(db, req, callback) {
	 			 var collection = db.collection('transportation');
	 		   collection.find(
           {$or : [
             {origin:`${req.body.origin}`,destination:`${req.body.destination}`},
             {origin:`${req.body.destination}`,destination:`${req.body.origin}`}
             ]}
          ).toArray(function(err, docs) {
	 		    if (err) {
	 		      callback('cannot connect to database', undefined);
	 		    } else{
	 		      if (docs.length !== 0) {
	 		        callback(undefined, docs);
	 		    	} else{
	 		           callback('cannot found',undefined);
	 		      }
	 		   }
	 		   });
	 	}


	 exports.plan = function(db, req, callback) {
		 			var collection = db.collection('place');
		 		  collection.find({city:`${req.body.destination}`}).toArray(function(err, docs) {
		 			 if (err) {
		 				 callback('cannot connect to database', undefined);
		 			 } else{
		 				 if (docs.length !== 0) {
		 					 callback(undefined, docs);
		 			 	 } else{
		 							callback('cannot found',undefined);
		 				 }
		 			}
		 			});
	 }

   exports.review = function (database, req){
     database.collection('trip').find({creator :req.body.username ,name: `${req.body.tripname}`})
     .toArray((error, result) =>{
       if(result.length == 1){
         database
         .collection('trip')
         .update(
        { name: `${req.body.tripname}`  },
        {
          $push: {
               reviews: {
               $each: [ {
                 user :`${req.body.username}`,
                 comment :`${req.body.comment}`,
                 creator: true,
                 date : date} ]
            }
          }
        }
       );
       }
       else {
         database
         .collection('trip')
         .update(
        { name: `${req.body.tripname}`  },
        {
          $push: {
               reviews: {
               $each: [ {
                 user :`${req.body.username}`,
                 comment :`${req.body.comment}`,
                 date : date} ]
            }
          }
        }
     );
       }
         });
   }
