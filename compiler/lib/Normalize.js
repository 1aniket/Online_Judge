export const normalize = (str) =>{
  str.trim().replace(/\s+/g, " ");
  console.log("Normalized:", { original: str, normalized: str });
  return str;
}
