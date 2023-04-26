const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc         get all bootcamps
//@routes       GET / api/v1/bootcamps
//@access       public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc         get single bootcamp
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
//@access       Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //Add user to req.body
  req.body.user = req.user.id;

  //Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //If the user not an admin they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    msg: `Bootcamp Created Successfully`,
    data: bootcamp,
  });
});

//@desc         update bootcamps
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

//@desc         delete bootcamps
//@routes       DELETE / api/v1/bootcamps/:id
//@access       Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID",
    });
  }

  bootcamp.removeBootcampAndCourseAssociatedWithIt();

  res.status(200).json({
    success: true,
    msg: `Deleted Successfully:  bootcamp ${req.params.id}`,
  });
});

//@desc         Upload photo for bootcamp
//@routes       PUT / api/v1/bootcamps/:id/photo
//@access       Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({
      success: false,
      msg: "Invalid ID",
    });
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
  }

  const file = req.files.file;

  //Make sure the upload file is image
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Image size must be less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
