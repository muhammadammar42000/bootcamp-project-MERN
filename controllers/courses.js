const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc         get all Courses
//@routes       GET / api/v1/courses
//@routes       GET / api/v1/bootcamps/:bootcampId/courses
//@access       Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(201).json(res.advancedResults);
  }
});

//@desc         get a single Course
//@routes       GET / api/v1/courses/:id
//@access       Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse(`Invalid ID: ${req.params.id}`, 404));
  } else {
    res.status(201).json({
      success: true,
      data: course,
    });
  }
});

//@desc         create new courses
//@routes       POST / api/v1/bootcamps/:bootcampId/courses
//@access       Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    msg: `Course Created Successfully`,
    data: course,
  });
});

//@desc         update Course
//@routes       PUT / api/v1/courses/:id
//@access       Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(new ErrorResponse(`Invalid ID: ${req.params.id}`, 404));
  } else {
    res.status(201).json({
      success: true,
      data: course,
    });
  }
});

//@desc         delete Course
//@routes       DELETE / api/v1/courses/:id
//@access       Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    return next(new ErrorResponse(`Invalid ID: ${req.params.id}`, 404));
  } else {
    res.status(201).json({
      success: true,
      msg: `CourseID ${req.params.id}  Deleted Successfully`,
      data: {},
    });
  }
});
