import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtQZV-k89VlGysxK_uOaBvFtdiJSyoPn0",
  authDomain: "rootc-3cf3d.firebaseapp.com",
  projectId: "rootc-3cf3d",
  storageBucket: "rootc-3cf3d.firebasestorage.app",
  messagingSenderId: "53648834373",
  appId: "1:53648834373:web:e91d9bbc41a098f9a4082c",
  measurementId: "G-NVFMG9J59K"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const names = [
  "Emma Thompson", "Liam Garcia", "Noah Patel", "Olivia Davis", "James Wilson",
  "Sophia Lee", "Lucas Miller", "Isabella Martinez", "Mason Taylor", "Mia Anderson",
  "Ethan Thomas", "Amelia Jackson", "Alexander White", "Harper Harris", "Henry Martin",
  "Evelyn Thompson", "Sebastian Garcia", "Abigail Martinez", "Jack Robinson", "Emily Clark"
];

const rootCauses = [
  { misconception: "Sign inversion", rootCause: "Sign rules under addition", weight: 0.45 },
  { misconception: "Wrong factor pair", rootCause: "Finding factor pairs", weight: 0.25 },
  { misconception: "Incomplete distribution", rootCause: "Distributive property", weight: 0.20 },
  { misconception: "Like terms combined incorrectly", rootCause: "Combining like terms", weight: 0.10 }
];

function getRandomCause() {
  const r = Math.random();
  let sum = 0;
  for (const cause of rootCauses) {
    sum += cause.weight;
    if (r <= sum) return cause;
  }
  return rootCauses[0];
}

async function seed() {
  console.log("Seeding database with 50 records...");
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const studentName = names[Math.floor(Math.random() * names.length)];
    const cause = getRandomCause();
    
    // Spread the timestamps over the last 7 days
    const pastTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    await addDoc(collection(db, "diagnoses"), {
      studentName,
      questionTopic: "Factoring Quadratics",
      misconception: cause.misconception,
      rootCause: cause.rootCause,
      timestamp: pastTime.toISOString()
    });
  }
  console.log("Successfully seeded 50 records.");
  process.exit(0);
}

seed().catch(console.error);
