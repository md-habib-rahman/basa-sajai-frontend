import axios from "axios";

// Get your free API key at https://api.imgbb.com/
const IMGBB_API_KEY = "78814773231fcf5b8d5bc788c93541bd";

export const uploadToImgBB = async (imageFile) => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
    );

    if (response.data && response.data.data) {
      return response.data.data.url; // Returns direct CDN URL
    }
    throw new Error("Image upload failed");
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw new Error("Failed to upload image to ImgBB");
  }
};
