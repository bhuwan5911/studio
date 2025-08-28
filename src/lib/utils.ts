import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadFile<T>(data: T[], format: 'csv' | 'json', filename: string) {
  let fileContent: string;
  let mimeType: string;
  let fileExtension: string;

  if (format === 'json') {
    fileContent = JSON.stringify(data, null, 2);
    mimeType = 'application/json';
    fileExtension = 'json';
  } else {
    const headers = Object.keys(data[0] as object).join(',');
    const rows = data.map(row => 
      Object.values(row as object).map(value => {
        const strValue = String(value);
        return strValue.includes(',') ? `"${strValue}"` : strValue;
      }).join(',')
    ).join('\n');
    fileContent = `${headers}\n${rows}`;
    mimeType = 'text/csv';
    fileExtension = 'csv';
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.${fileExtension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
