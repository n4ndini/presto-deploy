import AsyncLock from "async-lock";
import fs from "fs";
import jwt from "jsonwebtoken";
import { AccessError, InputError } from "./error.js";

const lock = new AsyncLock();

const JWT_SECRET = "llamallamaduck";
const DATABASE_FILE = "./database.json";

const { KV_REST_API_URL, KV_REST_API_TOKEN, USE_VERCEL_KV, VERCEL } = process.env;

const useKV =
  USE_VERCEL_KV === "true" &&
  !!KV_REST_API_URL &&
  !!KV_REST_API_TOKEN;

const useLocalFile = !VERCEL && !useKV;

/***************************************************************
                       State Management
***************************************************************/

let admins = {};

const update = async (admins) =>
  new Promise((resolve, reject) => {
    lock.acquire("saveData", async () => {
      try {
        if (useKV) {
          const response = await fetch(`${KV_REST_API_URL}/set/admins`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${KV_REST_API_TOKEN}`,
            },
            body: JSON.stringify({ admins }),
          });

          if (!response.ok) {
            return reject(new Error("Writing to Vercel KV failed"));
          }
        } else if (useLocalFile) {
          fs.writeFileSync(
            DATABASE_FILE,
            JSON.stringify(
              {
                admins,
              },
              null,
              2
            )
          );
        } else {
          // Running on Vercel without KV enabled.
          // Keep data in memory only so the function does not crash.
        }

        resolve();
      } catch (error) {
        console.log(error);
        reject(new Error("Writing to database failed"));
      }
    });
  });

export const save = async () => update(admins);

export const reset = async () => {
  admins = {};
  await update(admins);
};

try {
  if (useKV) {
    const response = await fetch(`${KV_REST_API_URL}/get/admins`, {
      headers: {
        Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      },
    });

    const data = await response.json();

    if (data?.result) {
      const parsed = JSON.parse(data.result);
      admins = parsed.admins || {};
    } else {
      admins = {};
    }
  } else if (useLocalFile) {
    const data = JSON.parse(fs.readFileSync(DATABASE_FILE, "utf8"));
    admins = data.admins || {};
  } else {
    admins = {};
  }
} catch (error) {
  console.log("WARNING: No database found, starting with empty store");
  admins = {};
}

/***************************************************************
                       Helper Functions
***************************************************************/

export const userLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire("userAuthLock", callback(resolve, reject));
  });

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = (authorization) => {
  try {
    const token = authorization.replace("Bearer ", "");
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in admins)) {
      throw new AccessError("Invalid Token");
    }
    return email;
  } catch (error) {
    throw new AccessError("Invalid token");
  }
};

export const login = (email, password) =>
  userLock((resolve, reject) => {
    if (email in admins) {
      if (admins[email].password === password) {
        return resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" }));
      }
    }
    reject(new InputError("Invalid username or password"));
  });

export const logout = (email) =>
  userLock((resolve) => {
    admins[email].sessionActive = false;
    resolve();
  });

export const register = (email, password, name) =>
  userLock((resolve, reject) => {
    if (email in admins) {
      return reject(new InputError("Email address already registered"));
    }
    admins[email] = {
      name,
      password,
      store: {},
    };
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" });
    resolve(token);
  });

/***************************************************************
                       Store Functions
***************************************************************/

export const getStore = (email) =>
  userLock((resolve) => {
    resolve(admins[email].store);
  });

export const setStore = (email, store) =>
  userLock((resolve) => {
    admins[email].store = store;
    resolve();
  });