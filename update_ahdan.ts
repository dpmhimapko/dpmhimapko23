
import { db, collection, getDocs } from './src/firebase';

async function listMembers() {
  try {
    const querySnapshot = await getDocs(collection(db, "members"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id}: ${doc.data().name} (${doc.data().akd})`);
    });
  } catch (error) {
    console.error("Error listing members:", error);
  }
}

listMembers();
