export const downloadImage = async (
  url: string,
  name: string
): Promise<void> => {
  return fetch(url)
    .then((resp) => {
      return resp.blob();
    })
    .then((blob) => {
      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((e) => console.log("An error sorry", e));
};
