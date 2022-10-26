import App from "./app.js"
import ClientResource from "./resources/clients/index.js"
import UserResource from "./resources/users/index.js"
new App([new UserResource(), new ClientResource()],Number(process.env.PORT || 5000)).listen()