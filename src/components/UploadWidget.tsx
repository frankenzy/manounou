// components/UploadWidget.jsx
'use client';

import { CldUploadWidget } from 'next-cloudinary';

const UploadWidget = () => {
  function handleUploadSuccess(result: any) {
    console.log("Upload successful:", result.info.secure_url);
    const [imageUrl, setImageUrl] = (window as any).imageUrlState || ['', () => {}];
    setImageUrl(result.info.secure_url);
  }

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleUploadSuccess}
    >
      {({ open }) => {
        return (
          <button onClick={() => open()}>
        Upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadWidget;
