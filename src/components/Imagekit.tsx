'use client';

import { CldImage } from 'next-cloudinary';

const Imagekit = () => {
  return (
    <CldImage
      width="400"
      height="300"
      src="<Your-Public-ID>"
      alt="Description of my image"
      crop="fill"
    />
  );
};

export default Imagekit;
