import { openDB } from "idb";

const initdb = async () =>
  openDB("jate", 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("[X] ERROR, JATE DATABASE EXIST!");
        return;
      }
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("[X] JATE DATABASE CREATED!");
    },
  });

export const putDb = async (content) => {
  const contactDb = await openDB("jate", 1);
  const txt = contactDb.transaction("jate", "readwrite");
  const store = txt.objectStore("jate");
  const request = store.put({ id: 1, text: content });
  const result = await request;
  console.log("[x] TEXT ADDED IN DB", JSON.stringify(result));
};

export const getDb = async () => {
  const contactDb = await openDB("jate", 1);
  const txt = contactDb.transaction("jate", "readonly");
  const store = txt.objectStore("jate");
  const request = store.getAll();
  const result = await request;
  if (result.length > 0) {
    console.log("[x] GET INFORMATION IN DB", JSON.stringify(result));
    return result[0].content;
  }
  return null;
};

initdb();
