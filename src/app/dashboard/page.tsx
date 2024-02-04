import type { FC } from "react";
import { auth, currentUser } from "@clerk/nextjs";
import { Dropzone } from "@/components/Dropzone";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { TableWrapper } from "@/components/Table/TableWrapper";
import type { FileType } from "@/types";
import { DeleteModal } from "@/components/DeleteModal";
import { RenameModal } from "@/components/RenameModal";
interface pageProps {}

const DashboardPage: FC<pageProps> = async ({}) => {
  const user = await currentUser();
  const userId = user!.id;
  const documents = await getDocs(collection(db, "users", user!.id, "files"));
  const files: FileType[] = documents.docs.map((doc) => ({
    id: doc.id,
    filename: doc.data().filename,
    timestamp: new Date(doc.data().timestamp?.seconds * 1000),
    fullname: doc.data().fullname,
    downloadURL: doc.data().downloadURL,
    size: doc.data().size,
    type: doc.data().type,
  }));

  return (
    <div>
      <section className="container space-y-5">
        <h1 className="text-xl my-4 font-bold">Welcome {user?.firstName}!</h1>
        <Dropzone />
        <TableWrapper initialFiles={files} userId={userId} />
      </section>
      <section>
        <RenameModal />
        <DeleteModal />
      </section>
    </div>
  );
};

export default DashboardPage;
