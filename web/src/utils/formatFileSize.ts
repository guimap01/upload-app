const units = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatFileSize(bytes: number): string {
  if (bytes < 0) {
    throw new Error("Size in bytes cannot be negative.");
  }
  let index = 0;
  let localBytesValue = bytes;
  while (localBytesValue >= 1024 && index < units.length - 1) {
    localBytesValue /= 1024;
    index++;
  }

  return `${localBytesValue.toFixed(2)}${units[index]}`;
}
