import { Request, Response } from 'express';
import sharp from 'sharp';

const fetchImages = async function(req: Request, res: Response) {
  let image = await sharp(
    __dirname + '/../../../public/img/' + req.params.image,
  );

  let result: Buffer;
  if (req.params.width && req.params.width) {
    result = await image
      .resize(parseInt(req.params.width), parseInt(req.params.height))
      .png()
      .toBuffer();
  } else {
    result = await image.png().toBuffer();
  }

  return res.type('png').send(result);
};

export default fetchImages;
