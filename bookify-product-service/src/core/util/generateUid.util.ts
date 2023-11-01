export function generateUID() {
  const characters = "0123456789abcdefghijklmnoprstuvyzxw";
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

  for (let i = 0; i < 36; i++) {
    if (uuid[i] === "x") {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uuid =
        uuid.substring(0, i) + characters[randomIndex] + uuid.substring(i + 1);
    } else if (uuid[i] === "y") {
      const randomIndex = Math.floor(Math.random() * 4) | 8;
      uuid =
        uuid.substring(0, i) + characters[randomIndex] + uuid.substring(i + 1);
    }
  }

  return uuid;
}
