import db from './db/connect.js';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import session from 'express-session';


// var express = require('express');
var app = express();
app.use(cors({
  'origin': "http://localhost:3000",
  'methods': ['GET,POST', 'PUT'],
  'credentials': true,
}));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session(
  {
    key: "user_id",
    secret: "kutti nayanthara",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24
    }
  }
))
// var mysql = require('mysql');
// var cors = require('cors');
// const bodyParser = require('body-parser');
// var bcrypt = require("bcrypt");
var saltRounds = 10;
// var multer = require('multer');
var fileName = "";

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "hrms3"

// });

app.use(express.json());
// app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/api/leave", (req, res) => {
  const supervisor_id = "125";
  const stat = "SELECT * FROM leave_table where leave_status='Pending' and supervisor_id=?;";
  db.query(stat, supervisor_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);

    }
  });


});



app.get("/api/getleave/:empId", (req, res) => {

  const employee_id = req.params.empId;
  const stat = "SELECT * FROM leave_table where employee_id=?";
  db.query(stat, employee_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);

    }
  });
});

app.get("/api/getleavesleft", (req, res) => {

  const stat = "SELECT Employee_id,Firstname,Lastname,Leaves_left from employee ;";
  db.query(stat, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);

    }
  });




});

app.get("/api/getBalanceLeave/:empId", (req, res) => {

  const employee_id = req.params.empId;
  console.log(employee_id)

  const stat = "SELECT Leaves_left FROM employee where employee_id=?";

  db.query(stat, employee_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result[0]['Leaves_left']);
      res.send(result[0]);

    }
  });
});







app.get("/api/getemps/:Username", (req, res) => {
  const email = req.params.Username;
  const sqlSelect = "select * from employee where email = ?";
  // console.log(email);
  db.query(sqlSelect, email, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result[0]['firstname']);
      res.send(result[0]);

    }
  })
})

app.get("/api/getemps2/:id", (req, res) => {
  const employee_id = req.params.id;
  const sqlSelect = "select * from employee where employee_id = ?";
  // console.log(employee_id);
  db.query(sqlSelect, employee_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result[0]['firstname']);
      res.send(result[0]);

    }
  })
})

// app.post("/api/getEmployee", (req, res) => {

//   const email = req.body.email;
//   console.log(email);
//   const sqlSelect = "select * from employee where email = ?;";
//   db.query(sqlSelect, email, (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {      
//       res.send(result[0]);

//     }
//   })
// })

app.post("/api/insertEmployee", (req, res) => {

  const data = req.body.employeeData
  const sqlInsert = "insert into employee (firstname,lastname,addressNo,street,city,payGrade,employmentStatus,partTime,jobTitle,supervisor,gender,dob,startDate,salary,email,department_id) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);"
  db.query(sqlInsert, [data.firstname, data.lastname, data.addressNo, data.street, data.city, data.payGrade, data.employmentStatus, data.partTime, data.jobTitle, data.supervisor, data.gender, data.dob, data.startDate, data.salary, data.email, data.department_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);

    }
  })
})

app.put('/api/updateEmployee', (req, res) => {
  const data = req.body.employeeData
  const sqlUpdate = "update employee set addressNo=?, street=?, city=?, salary=?, department_id=?,payGrade=?,jobTitle=?,employmentStatus=?,partTime=?,supervisor=? where employee_id = ?"
  db.query(sqlUpdate, [data.addressNo, data.street, data.city, data.salary, data.department_id, data.payGrade, data.jobTitle, data.employmentStatus, data.partTime, data.supervisor, data.employee_id], (err, result) => {
    if (err) console.log(err);
    else {
      console.log(data.employee_id);
      res.send({ message: "User details updated" });
    }
  })
})

app.put('/api/updateLeaves', (req, res) => {
  const data = req.body.employeeData
  const sqlUpdate = "update employee set leaves_left = ? where employee_id = ?"
  db.query(sqlUpdate, [data.Leaves_left, data.employee_id], (err, result) => {
    if (err) console.log(err);
    else {
      console.log(data.employee_id);
      res.send({ message: "Leave  details updated" });
    }
  })
})

app.post("/api/insertUser", (req, res) => {

  const data = req.body.employeeData
  const defaultPassword = data.email + "password";
  // console.log(defaultPassword)
  const sqlInsert = "insert into user_table (username,password) values (?,?);"
  bcrypt.hash(defaultPassword, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(sqlInsert, [data.email, hash], (err, result) => {
      if (err) {
        console.log(err);
        res.send({ message: "User(Email) already exists" });
      } else {
        res.send(data.email);

      }
    })
  })

})

app.post("/api/changePassword", (req, res) => {

  const email = req.body.email
  const password = req.body.password
  // console.log(email,password)
  const sqlUpdate = "UPDATE user_table SET password=? WHERE username=?"
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    }
    db.query(sqlUpdate, [hash, email], (err, result) => {
      if (err) {
        console.log(err);
        // res.send({ message: "User(Email) already exists" });
      } else {
        res.send(result);

      }
    })
  })
})

app.post("/api/insert", (req, res) => {

  const startDate = req.body.startDate;
  const duration = req.body.duration;
  const description = req.body.description;
  const type = req.body.type;
  const employee_id = req.body.employee_id;

  const supervisor_id = req.body.supervisor_id;
  const document = req.body.file;
  const status = req.body.status;

  // console.log(startDate);
  const stat = "INSERT INTO leave_table (duration,description,start_date,type,employee_id,supervisor_id,document,leave_status) values (?,?,?,?,?,?,?,?);";
  db.query(stat, [duration, description, startDate, type, employee_id, supervisor_id, document, status], (err, result) => {
    if (err) {
      console.log(err);

    } else {
      // console.log(req.file.filename)
    }
  })
  //     }
  //   });



  // });

});

app.post("/api/login", (req, res) => {
  const credentials = req.body.credentials;
  // console.log(credentials)
  const sqlSelect = "SELECT * from user_table where username= ?;";
  db.query(
    sqlSelect,
    [credentials.username],
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      } if (result.length > 0) {
        bcrypt.compare(credentials.password, result[0].password, (err, response) => {
          if (response) {
            console.log(result[0].username);
            req.session.user = result[0].username;
            console.log(req.session.user)
            res.send(result);
          } else {
            res.send({ message: "Wrong Username/Password! Recheck your credentials please" });

          }
        })
        // res.send(credentials.username);

      }
      else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

app.get("/api/login", (req, res) => {
  if (req.session.user) {
    const sqlSelect = "Select payGrade,jobTitle,supervisor from employee where email=?"
    db.query(sqlSelect, req.session.user, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result[0].payGrade);
        // res.send(result[0]);
        req.session.payGrade = result[0].payGrade;
        req.session.jobTitle = result[0].jobTitle;
        req.session.supervisor = result[0].supervisor;

        res.send({ loggedIn: true, user: req.session.user, payGrade: req.session.payGrade, jobTitle: req.session.jobTitle, supervisor: req.session.supervisor })

      }
    })
    // res.send({loggedIn:true,user:req.session.user})
  } else {
    res.send({ loggedIn: false })

  }
})

app.post("/api/sendApproval", (req, res) => {

  const status = req.body.status;
  const leave_id = req.body.leave_id;
  const employee_id = req.body.employee_id;
  const Leaves_left = req.body.Leaves_left;
  const sta = "Update leave_table set leave_status = ? where leave_id=? "
  const sta1 = "update employee set Leaves_left = ? where employee_id=?"

  db.query(sta, [status, leave_id], (err, result) => {
    if (err) {
      console.log(err);

    } else {

    }
  })


  db.query(sta1, [Leaves_left, employee_id], (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
      console.log(req.url);
    }
  })

});

app.post("/api/leaveReport", (req, res) => {

  const fromdate = req.body.from;
  const todate = req.body.to;
  const department_id = req.body.department_id;

  const v1 = "create view v1 as select leave_id, start_date, duration from leave_table left outer join employee using (employee_id) where start_date>=? and DATEADD(dd, duration, start_date)<=? and department_id=?;";
  const v2 = "create view v2 as select leave_id, start_date, datediff(day,start_date,?) as duration from leave_table left outer join employee using (employee_id) where start_date>=? and start_date <= ? and DATEADD(dd, duration, start_date)>=? and department_id=?;";
  const v3 = "create view v3 as select leave_id, start_date, datediff(day,?,DATEADD(dd, duration, start_date)) as duration from leave_table left outer join employee using (employee_id) where start_date<=? and DATEADD(dd, duration, start_date) >= ? and DATEADD(dd, duration, start_date)<=? and department_id=?;";
  const sqlselect = "select sum(duration) from v1 union all select sum(duration) from v2 union all select sum(duration) from v3;";

  db.query(v1, [fromdate, todate, department_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {

    }
  })

  db.query(v2, [todate, fromdate, todate, todate, department_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {

    }
  })

  db.query(v3, [fromdate, fromdate, fromdate, todate, department_id], (err, result) => {
    if (err) {
      console.log(err);
    } else {

    }
  })

  db.query(sqlselect, (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
      console.log(result);
    }
  })

});

app.post("/api/sendRejection", (req, res) => {

  const status = req.body.status;
  const leave_id = req.body.leave_id;

  const sta = "Update leave_table set leave_status = ? where leave_id=? "

  db.query(sta, [status, leave_id], (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);

    }
  })

});

app.post("/api/saveLeaveChanges", (req, res) => {

  const emp_id = req.body.emp_id;
  const leavesLeft = req.body.leavesLeft;
  const sta = "Update employee set Leaves_left = ? where Employee_id=?";

  db.query(sta, [leavesLeft, emp_id], (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.send(result);
      console.log(leavesLeft);
    }
  })

});



app.get("/api/geteId/:Username", (req, res) => {
  const emp_user = req.params.Username;
  const sqlSelect = "select employee_id from employee where email = ?";
  db.query(sqlSelect, emp_user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result[0]['firstname']);
      res.send(result[0]);

    }
  })
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
    fileName = file.originalname
  }
})

var upload = multer({ storage: storage }).single('file')

app.post('/upload', function (req, res) {

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //  return res.status(500).json(err)
    } else if (err) {
      //  return res.status(500).json(err)
    }
    var imgsrc = fileName
    res.send(imgsrc)
    // return res.status(200).send(req.file)

  })



});
app.listen(3001, () => {
  console.log("running on port 3001");
})


// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;