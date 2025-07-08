import cloudinary from "../config/cloudinary";

const uploadProfilePicture = async (
  file: Express.Multer.File
): Promise<string> => {
  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile_pictures",
            transformation: [
              { width: 400, height: 400, crop: "fill" },
              { quality: "auto" },
              { format: "auto" },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            if (!result || !("secure_url" in result)) {
              return reject(new Error("Upload failed"));
            }
            resolve(result as { secure_url: string });
          }
        )
        .end(file.buffer);
    }
  );

  return result.secure_url;
};

export default uploadProfilePicture;
