module.exports = (app, env, rp) => {
  const requestCustom = require("../utils/request");
  const serverRoutes = require("../utils/serverRoutes");
  const IncomingForm = require("formidable").IncomingForm;
  const fs = require("fs");
  

   /**
   * User crm for restaurant
   */
  app.post("/api/logs", (req, res) => {
	  let requestBody = JSON.stringify(req.body);  
	  fs.appendFileSync("./logs/logs.json",requestBody);
		res.status(200).json('saved');
  });
  
   /**
   * User crm for restaurant
   */
  app.get("/api/users/profile", (req, res) => {
    let requestBody = { ...req.query };    
    requestCustom.get(`${serverRoutes.userProfile}`, req, res, requestBody);
  });
  
	/**
	* To get the users profile
	*/
	app.post("/api/users/user-dashboard", (req, res) => {
		let requestBody = { ...req.body };    
		requestCustom.post(`${serverRoutes.userDashboard}`, req, res, requestBody);
	});

  /**
   * User crm for restaurant
   */
  app.get("/api/users/list", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.userList}`, req, res, requestBody);
  });

  app.post("/api/users/update", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.userUpdate}`, req, res, requestBody);
	let requestBodys = JSON.stringify(res.body);  
	  fs.appendFileSync("./logs/logs.json",requestBodys);
  });

  app.get("/api/users/view", (req, res) => {
    let requestBody = { ...req.query };   
    const userID = requestBody.id; 
    requestCustom.get(`${serverRoutes.userView}/${userID}`, req, res, requestBody);
  });

  

  app.post("/api/users/update-photo", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      if (files.photo) {
        formData.photo = {
          value: fs.createReadStream(files.photo.path),
          options: {
            filename: files.photo.name,
            contentType: files.photo.type,
          },
        };
      }
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userPhotoUpdate}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });

  app.post("/api/users/update-doc-resume", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      if (files.doc_resume) {
        formData.doc_resume = {
          value: fs.createReadStream(files.doc_resume.path),
          options: {
            filename: files.doc_resume.name,
            contentType: files.doc_resume.type,
          },
        };
      }
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userResumeUpdate}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });

  app.post("/api/users/delete-resume", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userResumeDelete}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });
  

  app.post("/api/users/update-doc-cover", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      if (files.doc_cover) {
        formData.doc_cover = {
          value: fs.createReadStream(files.doc_cover.path),
          options: {
            filename: files.doc_cover.name,
            contentType: files.doc_cover.type,
          },
        };
      }
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userCoverUpdate}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });

  app.post("/api/users/delete-cover", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userCoverDelete}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });
  
  app.post("/api/users/choose-default-resume", (req, res) => {
    var form = new IncomingForm();
    form.parse(req, function(err, fields, files) {
      var formData = fields;
      let access_token = req.session.user && req.session.user.access_token;
      var options = {
        method: "POST",
        uri: `${serverRoutes.userChooseDefaultResume}?access_token=${access_token}`,
        formData: formData
      };
      rp(options)
        .then(function(parsedBody) {
          let responseData = JSON.parse(parsedBody);
          res.status(200).json(responseData);
        })
        .catch(function(err) {
          res.status(500).json({ err: err });
        });
    });
  });

  app.post("/api/jobpostings/apply", (req, res) => {
    let requestBody = { ...req.body };    
    requestCustom.post(`${serverRoutes.jobApply}`, req, res, requestBody);
  });

  app.get("/api/jobpostings/applications/list-for-user", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.applicationsListForUser}`, req, res, requestBody);
  });

  app.get("/api/jobpostings/user-scoring", (req, res) => {
    let requestBody = { ...req.query };   
    requestCustom.get(`${serverRoutes.userScoring}`, req, res, requestBody);
  });
  
    app.post("/api/user/application/delete", (req, res) => {
    let requestBody = { ...req.body };    
	console.log(requestBody.id);
    requestCustom.post(`${serverRoutes.applicationDelete}/${requestBody.id}`, req, res, requestBody);
  });

};
