const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const vtonRoutes = require('./routes/vtonRoutes');
const productRoutes = require('./routes/productRoutes');
const  dotenv = require("dotenv");
const { fal } = require ("@fal-ai/client");


const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // your React app's URL
  })
);
dotenv.config();
fal.config({
  credentials: process.env.FAL_AI_API_KEY, // Using the key from .env
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/vton', vtonRoutes);
app.use('/api/products', productRoutes);


app.post("/api/v1/tryon", async (req, res) => {
  const { target_file_url, source_file_url , clothing_type} = req.body;
  

  if (!target_file_url || !source_file_url) {
    return res
      .status(400)
      .json({ error: "Both target and source image URLs are required" });
  }

    // 📦 Use conditional logic based on clothing_type
    if (clothing_type === "shirt") {
      try {
         const result = await fal.subscribe("fal-ai/cat-vton", {
          input: {
            human_image_url: target_file_url,
            garment_image_url: source_file_url,
            cloth_type: "upper", // You can modify this depending on the type of cloth
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          },
        });
    
        // Here, return the response after processing
        res.json({
          message: "Try-On request processed successfully!",
          // cropped_target_url: uploadResult.secure_url,
          result: result.data.image.url, // Uncomment if Fal API integration is needed
        });
      } catch (error) {
        console.error("Error with the Try-On process:", error);
        res.status(500).json({ error: "Error processing the Try-On request" });
      }
    } else if (clothing_type === "trouser") {
      try {
        const result = await fal.subscribe("fal-ai/cat-vton", {
         input: {
           human_image_url: target_file_url,
           garment_image_url: source_file_url,
           cloth_type: "lower", // You can modify this depending on the type of cloth
         },
         logs: true,
         onQueueUpdate: (update) => {
           if (update.status === "IN_PROGRESS") {
             update.logs.map((log) => log.message).forEach(console.log);
           }
         },
       });
   
       // Here, return the response after processing
       res.json({
         message: "Try-On request processed successfully!",
         // cropped_target_url: uploadResult.secure_url,
         result: result.data.image.url, // Uncomment if Fal API integration is needed
       });
     } catch (error) {
       console.error("Error with the Try-On process:", error);
       res.status(500).json({ error: "Error processing the Try-On request" });
     }
    } else {
      try {
        const result = await fal.subscribe("fal-ai/cat-vton", {
         input: {
           human_image_url: target_file_url,
           garment_image_url: source_file_url,
           cloth_type: "overall", // You can modify this depending on the type of cloth
         },
         logs: true,
         onQueueUpdate: (update) => {
           if (update.status === "IN_PROGRESS") {
             update.logs.map((log) => log.message).forEach(console.log);
           }
         },
       });
   
       // Here, return the response after processing
       res.json({
         message: "Try-On request processed successfully!",
         // cropped_target_url: uploadResult.secure_url,
         result: result.data.image.url, // Uncomment if Fal API integration is needed
       });
     } catch (error) {
       console.error("Error with the Try-On process:", error);
       res.status(500).json({ error: "Error processing the Try-On request" });
     }
    }
  
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});