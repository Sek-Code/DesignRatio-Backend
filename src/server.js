import { connectDB } from "./config/mongodb";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

try {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is fine on ${PORT}`);
    })
} catch (error) {
    console.error("Server failed!", error);
    process.exit(1);
}