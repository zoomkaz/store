export const addSpace = (str: string) => {
  return str.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
}