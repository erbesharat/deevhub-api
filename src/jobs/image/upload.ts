import { Request, Response } from 'express';

const upload = async function(req: Request, res: Response) {
  let fileNames: String[] = [];

  let files = await req.files;
  for (const file in files) {
    if (files.hasOwnProperty(file)) {
      const element = files[file];
      fileNames = [element.filename, ...fileNames];
    }
  }

  return res.json({
    images: fileNames,
  });
};

export default upload;
