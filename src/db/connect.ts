import { Client } from "pg";
import 'dotenv/config'

export const clientcon = new Client ({
    connectionString: process.env.DATABASE_URL
    
})

console.log(process.env.DATABASE_URL)

export async function connectTodb (){
    try {
        await clientcon.connect()
        console.log("Data base connected succefully")
    } catch (error : any) {
        console.error("Error while connecting", error.stack)
    }
}