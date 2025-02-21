interface CompressImageParams {
  file: File;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
export function compressImage({
  file,
  maxHeight = Number.POSITIVE_INFINITY,
  maxWidth = Number.POSITIVE_INFINITY,
  quality = 1,
}: CompressImageParams) {
  if (!allowedFileTypes.includes(file.type)) {
    throw new Error("Image format not supported");
  }

  return new Promise<File>((res, rej) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const compressed = new Image();

      compressed.onload = () => {
        const canvas = document.createElement("canvas");

        let width = compressed.width;
        let height = compressed.height;

        if (width > height && width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        if (width === height && (width > maxWidth || height > maxHeight)) {
          height = maxHeight;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          return rej("Failed to get canvas context");
        }

        context.drawImage(compressed, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return rej("Failed to compress image");
            }

            const compressedFile = new File([blob], convertToWebp(file.name), {
              type: "image/webp",
              lastModified: Date.now(),
            });

            res(compressedFile);
          },
          "image/webp",
          quality
        );
      };

      compressed.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function convertToWebp(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return `${filename}.webp`;
  }

  return `${filename.substring(0, lastDotIndex)}.webp`;
}
