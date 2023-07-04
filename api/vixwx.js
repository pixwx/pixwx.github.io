const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dh0airrj5',
  api_key: 's438198715258561',
  api_secret: 'sbKWdyEUmK5q7A_24jgsU2JPFac'
});

export default async function handler(req, res) {
    const { username, avatar } = req.body;
  
    try {
      const result = await cloudinary.uploader.upload(avatar, {
        public_id: username,
        overwrite: false,
        transformation: [
          { 
            width: 150, 
            height: 150, 
            crop: "fill", 
            gravity: "face", 
            radius: "max", 
            border: { width: 2, color: "#fff" } 
          },
          { 
            overlay: { font_family: "Arial", font_size: 20, text: username }, 
            gravity: "south", 
            color: "#fff" 
          },
          { 
            height: 300, 
            width: 300, 
            crop: "pad", 
            background: "rgb:000000", 
            radius: 20 
          },
        ],
      });
  
      res.status(200).json({ url: result.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
