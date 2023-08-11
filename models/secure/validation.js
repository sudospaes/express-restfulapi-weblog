const yup = require("yup");

const userValidationSchema = yup.object().shape({
  fullname: yup
    .string()
    .min(4, "Fullname can't be under of 4 character")
    .max(255)
    .required("Fullname is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup
    .string()
    .min(4, "Password can't be under of 4 character")
    .max(255)
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Password is not match"),
});

const postValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "Post title can't be under of 5 character")
    .max(50, "Post title can't be upper of 50 character")
    .required("Post title is required"),
  body: yup
    .string()
    .min(5, "Post content can't be under of 5 character")
    .required("Post content is required"),
  status: yup
    .mixed()
    .required("Status is required")
    .oneOf(["public", "private"], "Status is not vaild"),
  thumbnail: yup.object().shape({
    name: yup.string().required("Thumbnail is required"),
    size: yup.number().max(4000000, "Thumbnail can't be larger of 4MB"),
    mimetype: yup.mixed().oneOf(["image/jpeg", "image/png"]),
  }),
});

module.exports = {
  userValidationSchema,
  postValidationSchema,
};
