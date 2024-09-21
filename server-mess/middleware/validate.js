const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body); // this method ensure that the schema is mathched with the user filled data.
    req.body = parseBody;
    next();
  } catch (error) {
    const message = error.errors[0].message;
    const status = 422;
    const extraDetails = error.errors[0];
    const err = {
      status,
      message,
      extraDetails,
    };

    console.log(err);
    next(err);
  }
};

module.exports = { validate };
