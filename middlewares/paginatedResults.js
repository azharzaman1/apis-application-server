import mongoose from "mongoose";

export const paginatedResults = (Model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query?.page);
    const limit = parseInt(req.query?.limit);
    const query = req.query?.query;
    const filterString = req.query?.filter;

    const skipIndex = (page - 1) * limit;
    console.log(query ? query : "Nil", page, limit, skipIndex);

    try {
      if (page && limit) {
        // pagination params defined - return paginated result
        let results = await Model.find({
          api_name_lowercase: query
            ? new RegExp(String(query).toLowerCase())
            : new RegExp(),
        })
          .limit(limit)
          .skip(skipIndex)
          .select("API Slug Link Description Category")
          .exec();

        Model.countDocuments(
          {
            api_name_lowercase: query
              ? new RegExp(String(query).toLowerCase())
              : new RegExp(),
          },
          (error, count) => {
            if (error) {
              console.log(error.message);
            }

            res.paginatedResults = results;
            res.nextPage = count - skipIndex - limit > 0 ? true : false;
            res.totalDocs = count;
            res.currentPage = page;
            res.currentLimit = limit;
            res.nextPageNo = page + 1;
            next();
          }
        );
      }
      // return full results
      res.paginatedResults = await Model.find().exec();
      next();
    } catch (err) {
      res.statusMessage = err.message;
      res.sendStatus(500);
    }
  };
};
