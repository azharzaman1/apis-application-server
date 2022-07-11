export const paginatedResults = (Model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query?.page);
    const limit = parseInt(req.query?.limit);
    const query = req.query?.query;
    const filterString = req.query?.filter;

    const skipIndex = (page - 1) * limit;
    console.log(page, limit, skipIndex);
    let results = [];

    try {
      if (page && limit) {
        // pagination params defined - need paginated result
        results = await Model.find()
          .where("API")
          .equals(query ? new RegExp(query) : new RegExp())
          .limit(limit)
          .skip(skipIndex)
          .select("API Link Description Category")
          .exec();

        Model.countDocuments({}, (err, count) => {
          res.paginatedResults = results;
          res.nextPage = count - skipIndex - limit > 0 ? true : false;
          res.totalDocs = count;
          res.currentPage = page;
          res.currentLimit = limit;
          res.nextPageNo = page + 1;
          next();
        });
      }
      // return full results
      results = await Model.find().exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      res.statusMessage = err.message;
      res.sendStatus(500);
    }
  };
};
