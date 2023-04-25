const advancedResults = (model, populate) => async (req, res, next) => {
  // console.log(req.query);
  let query;

  //Copy of req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  //Loop over removeFields and deletethem from reqQuery
  removeFields.map((param) => delete reqQuery[param]);

  //Create Query String
  let queryString = JSON.stringify(reqQuery);

  //Create Operator {$gte, $gt, $lte ... etc}
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt|in)\b/g,
    (match) => `$${match}`
  );
  // console.log(queryString);

  //Finding Resourse
  query = model.find(JSON.parse(queryString));

  //select field
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort field
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination & Limit
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing Query
  const results = await query;

  //Pagination result

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
