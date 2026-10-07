import { db } from "@/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { FileSystemUploadType } from "expo-file-system/legacy";
import { doc, getDoc, setDoc } from "firebase/firestore";

const USER_ID_KEY = "@wishlist_user_id";

export const getOrCreateUserId = async (): Promise<string> => {
  let userId = await AsyncStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 9);
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

export const generatePairingCode = async (): Promise<string> => {
  const userId = await getOrCreateUserId();
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await setDoc(doc(db, "pairing_codes", code), {
    ownerId: userId,
    createdAt: new Date().toISOString(),
  });

  return code;
};

export const connectWithPairingCode = async (code: string): Promise<string> => {
  const codeDocRef = doc(db, "pairing_codes", code.trim());
  const codeDoc = await getDoc(codeDocRef);

  if (!codeDoc.exists()) {
    throw new Error("The pairing code expired!");
  }

  const partnerId = codeDoc.data().ownerId;
  const myUserId = await getOrCreateUserId();

  if (partnerId === myUserId) {
    throw new Error("You cannot use your pairing code!");
  }

  await setDoc(doc(db, "users", myUserId), { partnerId }, { merge: true });
  await setDoc(
    doc(db, "users", partnerId),
    { partnerId: myUserId },
    { merge: true },
  );

  await AsyncStorage.setItem("@partner_user_id", partnerId);

  return partnerId;
};

export const getPartnerId = async (): Promise<string | null> => {
  const myUserId = await getOrCreateUserId();
  const userDoc = await getDoc(doc(db, "users", myUserId));

  if (userDoc.exists() && userDoc.data()?.partnerId) {
    return userDoc.data().partnerId;
  }
  return null;
};

export const uploadImageToCloudinary = async (uri: string): Promise<string> => {
  const cloudName = "o863ydh2";
  const uploadPreset = "images";

  try {
    const response = await FileSystem.uploadAsync(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      uri,
      {
        httpMethod: "POST",
        // 2. A hívásnál a legacy enum értéket használjuk (számmá fordul le Androidon)
        uploadType: FileSystemUploadType.MULTIPART,
        fieldName: "file",
        parameters: {
          upload_preset: uploadPreset,
        },
      }
    );

    const result = JSON.parse(response.body);

    if (result.secure_url) {
      return result.secure_url;
    } else {
      console.error("Cloudinary válasz hiba:", result);
      throw new Error(result.error?.message || "Kép feltöltése sikertelen");
    }
  } catch (error) {
    console.error("Cloudinary feltöltési hiba:", error);
    throw error;
  }
};