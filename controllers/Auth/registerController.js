import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler";

const registerController = {
  async register(req, res, next) {
    //Validations

    const registrationSchema = Joi.object({
      name: Joi.string().min(2).max(35).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    const { error } = registrationSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      const exist = await User.exists({ email: req.body.email });

      if (exist) {
        return next(
          CustomErrorHandler.alreadyExists("This email already exists")
        );
      }
    } catch (error) {
      return next(error);
    }

    res.json({ msg: "Hello from validated code" });
  },
};

export default registerController;
