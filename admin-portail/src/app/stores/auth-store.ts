import {User} from "../features/auth/models/user";

export function getUserFromLocalStorage(): User | null {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}
