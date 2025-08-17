export function getUserDetails() {
  try {
    const storedUser = localStorage.getItem("todoAppUser");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    console.error("Error parsing stored user", e);
    return null;
  }
}
