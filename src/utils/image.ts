export const pathToUrl = (filePath: string) => {
    return encodeURI(import.meta.env.VITE_BASE_API + "/file/get?filePath=" + filePath)
}