import { AppUserAuth } from "./app-user-auth";

export const LOGIN_MOCKS: AppUserAuth[] = [
  {
    userName: "Admin1",
    password:"Admin123",
    isAuthenticated: true,
    canAccessPatients: true,
  },
  ,
  {
    userName: "Admin2",
    password:"Admin123",
    isAuthenticated: true,
    canAccessPatients: true,
   },
  {
    userName: "User1",
    password:"User123",
    isAuthenticated: true,
    canAccessPatients: false,
   }
   ,
  {
    userName: "User1",
    password:"User123",
    isAuthenticated: true,
    canAccessPatients: false,
   }
];
