const express = require('express');
const router = express.Router();
const Student = require('../models/students');
const multer = require('multer');
const fs = require('fs');
const { log } = require('console');

// image upload
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'./uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
  }
});

var upload = multer({
  storage: storage
}).single('studentImageFileName');

// Insert a student into database route
router.post('/add', upload, (req, res) => {
  const student = new Student({
    num: req.body.num,
    name: req.body.name,
    email: req.body.email,
    sType: req.body.sType,
    phone: req.body.phone,
    package: req.body.package,
    wk: req.body.wk,
    colour: req.body.colour,
    startDate: req.body.startDate,
    startYr: 2011,
    startMth: 11,
    startDay: 11,
    classesNishCancelled: req.body.classesNishCancelled,
    birthday: req.body.birthday,
    studentImageFileName: req.file.filename,
  });

  student.save()
  .then((result) => {
    // console.log('in then');
    req.session.message = {
      type: 'success',
      message: 'Student added successfully'
    };
    res.redirect('/')
  })
  .catch(err => {
    console.log('SAVE did not work', err.message);
    // res.json({message: err.message, type: 'danger'});
  })
});

// student.save((err) => {
//   if (err) {
//     res.json({message: err.message, type: 'danger'});
//   } else {
//     req.session.message = {
//       type: 'success',
//       message: 'Student added successfully'
//     };
//     res.redirect('/')
//   }
// })

router.get('/', (req, res) => {

  Student.find().exec()
  .then(students => {
    res.render('index', {
      title: 'Home Page',
      students: students
    })
  })
  .catch(err => {
    res.json({ message: err.message});
    console.log('FIND did not work', err.message);
  })

  // Student.find().exec((err, students) => {
  //   if (err) {
  //     res.json({ message: err.message})
  //   } else {
      // res.render('index', {
      //   title: 'Home Page',
      //   students: students
      // })
  //   }
  // })

});

router.get('/add', (req, res) => {
  res.render('add_students', { title: 'Add Students'});
});

// router.get('/students', (req, res) => {
//   res.send("All Students");
// });

//Edit a student route
router.get('/edit/:id', (req, res) => {
  let id = req.params.id;
  Student.findById(id).exec()
  .then(student => {
    if (student) {
    res.render('edit_students', {
      title: 'Edit Student',
      student: student
    })}
    else {
      res.redirect('/');
    }
  })
  .catch(err => {
    res.redirect('/');
  })
})

// Update Student Route
router.post('/update/:id', upload, (req, res) => {
  let id = req.params.id;
  let new_image = '';

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync('./uploads/'+req.body.old_image);
    } catch(err) {
      // console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  Student.findByIdAndUpdate(id, {
    num: req.body.num,
    name: req.body.name,
    email: req.body.email,
    sType: req.body.sType,
    phone: req.body.phone,
    package: req.body.package,
    wk: req.body.wk,
    colour: req.body.colour,
    startDate: req.body.startDate,
    startYr: 2011,
    startMth: 11,
    startDay: 11,
    classesNishCancelled: req.body.classesNishCancelled,
    birthday: req.body.birthday,
    studentImageFileName: new_image,
  })
  .then(result => {
    req.session.message = {
      type: 'success',
      message: 'Student updated successfully'
    };
    res.redirect('/');
  })
  .catch(err => {
    res.json({ message: err.message, type: 'danger'});
    console.log('UPDATE did not work', err.message);
  })
});

// Delete Student Route
router.get('/delete/:id', (req, res) => {
  let id = req.params.id;
  Student.findByIdAndDelete(id)
  .then(result => {
    if (result.studentImageFileName) {
      try {
        fs.unlinkSync('./uploads/'+result.studentImageFileName);
        req.session.message = {
          type: 'info',
          message: 'Student deleted successfully'
        };
        res.redirect('/');
      } catch(err) {
        console.log(err);
      }
    }
  })
  .catch(err => {
    res.json({ message: err.message});
  })
})



module.exports = router;