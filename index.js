const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const { MONGO_URI, SECRET } = require("./config");

const passport = require("./services/passport");
const AuthRoute = require("./routes/Auth");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", AuthRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("conected to mongo database"))
  .catch((e) => console.error(e));

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
