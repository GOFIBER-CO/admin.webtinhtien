export const handleKeyWord = (keyword) => {
  keyword = keyword?.split("\n");
  keyword = keyword?.filter((item) => item !== "");
  return keyword;
};
export const handleArrayToString = (listKey) => {
    const temp = listKey?.join('\n')
    return temp
}