const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc         get all bootcamps
//@routes       GET / api/v1/bootcamps
//@access       public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps",
    count: bootcamps.length,
    data: bootcamps,
  });
});

//@desc         get single bootcamps
//@routes       GET / api/v1/bootcamps/:id
//@access       public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    // res.status(400).json({
    //   success: false,
    //   msg: "Invalid ID",
    // });

    return next(new ErrorResponse(`Invalid ID: ${req.params.id}`, 404));
  } else {
    res.status(200).json({
      success: true,
      msg: `Show bootcamp ${req.params.id}`,
      data: bootcamp,
    });
  }
});

//@desc         create new bootcamps
//@routes       POST / api/v1/bootcamps
//@access       private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    msg: `Create New Bootcamp`,
    data: bootcamp,
  });
});

//@desc         update new bootcamps
//@routes       PUT / api/v1/bootcamps/:id
//@access       private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID",
    });
  }

  res.status(200).json({
    success: true,
    msg: `Update bootcamp ${req.params.id}`,
    data: bootcamp,
  });
});

//@desc         delete new bootcamps
//@routes       DELETE / api/v1/bootcamps/:id
//@access       private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID",
    });
  }
  res.status(200).json({
    success: true,
    msg: `Deleted Successfully:  bootcamp ${req.params.id}`,
  });
});
