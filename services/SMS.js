import fetch from "node-fetch"
import dotenv from "dotenv"
dotenv.config()
class SMS {
  static senderId;
  static send = async (recipient, message) =>{
    try {

    const data = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method:"POST",
        headers:{
            Authorization:`Key a3078e67fa32d9d38a0f9dfefcfa3e528ba4245149ee6b64c72ee041fe02a3c8`,
            'Content-Type': 'application/json',
            'Accept':'application/json'
        }
    })
    const result = await data.json()
    console.log(result);
    console.log({key: process.env.SMS_API_KEY});
    } catch (error) {
        console.dir("Error ", error.message);
    }
  }
  static balance = async () =>{
    try {
    const data = await fetch("https://api.smsonlinegh.com/v4/report/balance", {
        headers:{
            Authorization:`key a3078e67fa32d9d38a0f9dfefcfa3e528ba4245149ee6b64c72ee041fe02a3c8`,
            'Content-Type': 'application/json',
            'Accept':'application/json'
        }
    })
    const result = await data.json()
    console.log(result);
    } catch (error) {
        console.log("Error ", error);
    }
  }
}

SMS.balance()