process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config({path: "./src/config/.env"});
const {connectDb} = require("./src/config/db");
const UserRoute = require("./src/routes/user.route");
const RegionRoute = require("./src/routes/region.route");
const LCroute = require('./src/routes/edu_center.route')
const RegistrationRoute = require('./src/routes/course.registration.route')
const BranchRoute = require('./src/routes/branch.route')
const FieldsRoute = require('./src/routes/fields.route')
const SubjectsRoute = require('./src/routes/subjects.route')

const { swaggerUi, specs } = require("./src/config/swagger");
// const uploadImageRoute = require("./src/route/multer.route");
const path = require("path");

const express = require("express");
const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/users", UserRoute);
app.use("/regions", RegionRoute);
app.use("/edu-center", LCroute)
app.use("/registration", RegistrationRoute)
app.use("/branch", BranchRoute)
app.use("/fields", FieldsRoute)
app.use("/subjects", SubjectsRoute)

// app.use("/image", express.static(path.join(__dirname, "src", "uploads")));
connectDb();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`swagger ui is available at "https://localhost:${PORT}/api-docs"`)
})