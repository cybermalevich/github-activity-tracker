export default function generateUrl(url: string, placeholderValueMap: Record<string, string>): string {
  let result = url;

  for (const [key, value] of Object.entries(placeholderValueMap)) {
    result = result.replace(`{${key}}`, value);
  }

  return result;
}
