 var request = require('request');


 ////create image
 // request({
 //     method: 'POST',
 //     uri: 'https://g-staging.codefresh.io/api/services/codefresh-io/bamigrash/create',
 //     //Lets post the following key/values as form
 //     headers: {
 //         "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNTkiLCJhY2NvdW50SWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNWEiLCJpYXQiOjE0NzExODU2MTQsImV4cCI6MTQ3Mzc3NzYxNH0.PExsLcZaNYvnMfCQujfaWXQftgFl3P_Cgr5VRM6RFZ4",
 //         "Content-Type": "application/json",
 //         "Accept": "application/json"
 //     },
 //     json:true,
 //     body:{
 //         "services":
 //             [
 //                 {
 //                     "name": "test",
 //                     "imageName": "blah/blah2",
 //                     "ports": ["9000"],
 //                     "applicationPort": "9000",
 //                     "useDockerfileFromRepo": true,
 //                     "dockerFilePath": "Dockerfile"
 //                 }
 //             ]
 //     }
 // }, function(error, response, body){
 //     if(error) {
 //         console.log(error);
 //     } else {
 //         console.log(response.statusCode, body);
 //     }
 // });

 ////create image new enging
 // request({
 //     method: 'POST',
 //     uri: 'https://g-staging.codefresh.io/api/workflow/codefresh-io/bamigrash/file',
 //     //Lets post the following key/values as form
 //     headers: {
 //         "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNTkiLCJhY2NvdW50SWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNWEiLCJpYXQiOjE0NzExODU2MTQsImV4cCI6MTQ3Mzc3NzYxNH0.PExsLcZaNYvnMfCQujfaWXQftgFl3P_Cgr5VRM6RFZ4",
 //         "Content-Type": "application/json",
 //         "Accept": "application/json"
 //     },
 //     json: true,
 //     body: {
 //         "branch": "itaicheck"
 //     }
 // }, function (error, response, body) {
 //     if (error) {
 //         console.log(error);
 //     } else {
 //         console.log(response.statusCode, body);
 //     }
 // });
 //find image
 // request({
 //     method: 'GET',
 //     uri: 'https://g-staging.codefresh.io/api/images/itaitask%2Fwithyamlnewengine/tags',
 //     //Lets post the following key/values as form
 //     headers: {
 //         "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNTkiLCJhY2NvdW50SWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNWEiLCJpYXQiOjE0NzExODU2MTQsImV4cCI6MTQ3Mzc3NzYxNH0.PExsLcZaNYvnMfCQujfaWXQftgFl3P_Cgr5VRM6RFZ4",
 //         "Content-Type": "application/json",
 //         "Accept": "application/json"
 //     },
 //     json: true,
 //     body: {
 //         imagename:"itaitask/withyamlnewengine"
 //     }
 // }, function (error, response, body) {
 //     if (error) {
 //         console.log(error);
 //     } else {
 //         console.log(response.statusCode, body);
 //     }
 // });
// //launch image by service id
//  request({
//      method: 'POST',
//      uri: 'https://g-staging.codefresh.io/api/runtime/testit',
//      //Lets post the following key/values as form
//      headers: {
//          "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNTkiLCJhY2NvdW50SWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNWEiLCJpYXQiOjE0NzExODU2MTQsImV4cCI6MTQ3Mzc3NzYxNH0.PExsLcZaNYvnMfCQujfaWXQftgFl3P_Cgr5VRM6RFZ4",
//          "Content-Type": "application/json",
//          "Accept": "application/json"
//      },
//      json: true,
//      body: {
//          "repoOwner": "codefresh-io",
//          "repoName": "bamigrash",
//          "sha":"5b8e120be5ddae0ec8443bddfa5e68ef5f372a64",
//          "branch": "itaicheck",
//          "serviceId": "57b08be22890df0500a30662",
//          "repoData": {
//              "url": {
//                  "https": "https://github.com/codefresh-io/bamigrash"
//              }
//          }
//      }
//  }, function (error, response, body) {
//      if (error) {
//          console.log(error);
//      } else {
//          console.log(response.statusCode, body);
//      }
//  });

//composition -yaml
 request({
     method: 'POST',
     uri: 'https://g-staging.codefresh.io/api/runtime/testit',
     //Lets post the following key/values as form
     headers: {
         "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNTkiLCJhY2NvdW50SWQiOiI1N2IwMzQ0NzI4YTVhODA1MDBkMmJhNWEiLCJpYXQiOjE0NzExODU2MTQsImV4cCI6MTQ3Mzc3NzYxNH0.PExsLcZaNYvnMfCQujfaWXQftgFl3P_Cgr5VRM6RFZ4",
         "Content-Type": "application/json",
         "Accept": "application/json"
     },
     json: true,
     body: {
         "repoOwner": "codefresh-io",
         "repoName": "bamigrash",
         "sha":"5b8e120be5ddae0ec8443bddfa5e68ef5f372a64",
         "branch": "itaicheck",
         "serviceId": "57b08be22890df0500a30662",
         "repoData": {
             "url": {
                 "https": "https://github.com/codefresh-io/bamigrash"
             }
         }
     }
 }, function (error, response, body) {
     if (error) {
         console.log(error);
     } else {
         console.log(response.statusCode, body);
     }
 });



 // request({
 //     method: 'GET',
 //     uri: 'https://www.google.com'
 // }, function(err,res, body){
 //     if(err) {
 //         console.log(err);
 //     } else {
 //         console.log(res.statusCode);
 //     }
 // });

 // request('https://g.codefresh.io/api/builds/57a84d24f8689e0500c32e62', function (error, response, body) {
 // //     if(error){
 // //         console.log(error);
 // //     }
 //     if (response) {
 //         console.log(body);
 //     }
 //     if (!error && response.statusCode == 200) {
 //         console.log(body); // Print the google web page.
 //     }
 // })
 //
 // //////////////////////
 //
 // ///__________PIPLINE , itai-codefresh, bamigrash
 // {
 //     "services"
 // :
 //     [
 //         {
 //             "name": "test",
 //             "imageName": "blah/blah2",
 //             "ports": ["3000"],
 //             "applicationPort": "3000",
 //             "useDockerfileFromRepo": true,
 //             "dockerFilePath": "Dockerfile"
 //         }
 //     ]
 // }
 //
 // //BUILD_________________
 //
 // {
 //     "branch" : "master",
 //     "isYamlService" : false,
 //     "repoName" : "antennas",
 //     "repoOwner" : "shay-codefresh",
 //     "serviceId" : "57ac74c1f77caf05006cf8e0",
 //     "type": "build"
 // }
 //
 // //antenna service id
 // "57a84d24f8689e0500c32e62"
 //
 //
 //
 // {
 //     "branch": "master",
 //     "sha": "7dda594c6ae91e36fc76d2030cb9efb6e5afffa7be26a8fb6a7b7536aa54407f",
 //     "buildFlags": {
 // //     "nocache": false
 // // }
 // // }
 // //
 //
 //
 //
 //
 // // var formData = {
 // //     "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhiNzIxZjNkNWY1ZTA1MDBhZWU4MTUiLCJhY2NvdW50SWQiOiI1NzhiNzI0YTcyODE2MTA1MDA3NTI3NDkiLCJpYXQiOjE0NzA5MTk4MzksImV4cCI6MTQ3MzUxMTgzOX0.say2HG5r77LWoyyT5w-BsilvmV5JMSQ7UoAQp8Ba3Vg" , repoOwner:"itai-codefresh",
 // //     repoName:"bamigrash",
 // //     name: "test",
 // //     imageName: "blah/blah2",
 // //     ports: ["9000"],
 // //     applicationPort: "9000",
 // //     useDockerfileFromRepo: true,
 // //     dockerFilePath: "Dockerfile"
 // // };
 // // request.post({url:'http://g.codefresh.io/api/services/itai-codefresh/bamigrash/create', formData: formData}, function optionalCallback(err, httpResponse, body) {
 // //     if (err) {
 // //         return console.error('upload failed:', err);
 // //     }
 // //     console.log('Upload successful!  Server responded with:', body);
 // // });
 // //
 // //  var request = require('request');
 //
 //
 //
 //  //Lets configure and request
 //  request({
 //      url: 'http://g.codefresh.io/api/services/codefresh-io/bamigrash/create',
 //      method: 'POST',
 //      //Lets post the following key/values as form
 //      headers: {
 //          "x-access-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhiNzIxZjNkNWY1ZTA1MDBhZWU4MTUiLCJhY2NvdW50SWQiOiI1NzhiNzI0YTcyODE2MTA1MDA3NTI3NDkiLCJpYXQiOjE0NzA5MTk4MzksImV4cCI6MTQ3MzUxMTgzOX0.say2HG5r77LWoyyT5w-BsilvmV5JMSQ7UoAQp8Ba3Vg",
 //      },
 //
 // body:{
 //
 //     name: "test",
 //     imageName: "blah/blah2",
 //     ports: ["9000"],
 //     applicationPort: "9000",
 //     useDockerfileFromRepo: true,
 //     dockerFilePath: "Dockerfile"
 //
 // }
 //
 //
 //  }, function(error, response, body){
 //      if(error) {
 //          console.log(error);
 //      } else {
 //          console.log(response.statusCode, body);
 //      }
 //  });
 //

 //
 // request({
 //
 //     url: 'http://g.codefresh.io/api/services/codefresh-io/bamigrash/create',
 //     method: 'POST',
 //     //Lets post the following key/values as form
 //     headers: [
 //         {
 //             name: "x-access-token",
 //             value: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NzhiNzIxZjNkNWY1ZTA1MDBhZWU4MTUiLCJhY2NvdW50SWQiOiI1NzhiNzI0YTcyODE2MTA1MDA3NTI3NDkiLCJpYXQiOjE0NzA5MTk4MzksImV4cCI6MTQ3MzUxMTgzOX0.say2HG5r77LWoyyT5w-BsilvmV5JMSQ7UoAQp8Ba3Vg",
 //         }
 //     ],
 //    postData: {
 //         params:[
 //             {
 //               name:"name",
 //                 value:"test"
 //             },
 //             {
 //                 name:"imageName",
 //                 value:"blah/blah2"
 //             },
 //             {
 //                 name:"ports",
 //                 value:["9000"]
 //             },
 //             {
 //                 name:"applicationPort",
 //                 value:"9000"
 //             },
 //             {
 //                 name:"useDockerfileFromRepo",
 //                 value:true
 //             },
 //             {
 //                 name:"dockerFilePath",
 //                 value:"Dockerfile"
 //             }
 //         ]
 //    }
 // }, function(error, response, body){
 //     if(error) {
 //         console.log(error);
 //     } else {
 //         console.log(response.statusCode, body);
 //     }
 // });
 //


