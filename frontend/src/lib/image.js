const MAX_DIMENSION = 256;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

/**
 * Reads a picked file, crops it square and shrinks it to 256px, then returns a
 * JPEG data URL small enough to post to the API.
 */
export const fileToAvatarDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose an image file (JPG, PNG or WebP)."));
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      reject(new Error("That image is over 8MB. Please choose a smaller one."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = MAX_DIMENSION;
        canvas.height = MAX_DIMENSION;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          MAX_DIMENSION,
          MAX_DIMENSION
        );
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
