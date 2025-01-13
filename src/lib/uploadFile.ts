//src/lib/uploadFile.ts

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function validateFile(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size should not exceed 5MB');
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Only PDF and Word documents are allowed');
  }
}

export async function fileToBase64(file: File): Promise<string> {
  validateFile(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function uploadFile(file: File): Promise<string> {
  return await fileToBase64(file);
}
