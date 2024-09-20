import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as fs from 'fs';

export const MulterConfig = (folderPath: string) => ({
  storage: diskStorage({
    destination: function (req, file, callback) {
      const baseUploadPath = resolve('public', 'uploads', folderPath);
      
      fs.mkdir(baseUploadPath, { recursive: true }, (error) => {
        if (error) {
          console.error("Failed to create directory:", error); // Log error for troubleshooting
          callback(error, baseUploadPath);
        } else {
          callback(null, baseUploadPath);
        }
      });
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const fileExtName = extname(file.originalname);
      const cleanFilename = file.originalname.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${cleanFilename}-${uniqueSuffix}${fileExtName}`;
      callback(null, fileName);
    },
  }),
});
