import App from "./app.js"
import UserResource from "./resources/users/index.js"
new App([new UserResource()],Number(process.env.PORT || 5000)).listen()