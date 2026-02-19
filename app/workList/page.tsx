import type { Metadata } from "next";
import BookListPage from "../components/workPage/workLinst";

export const metadata: Metadata = {
  title: "Your Works — mebookmeta",
  description: "Manage your uploaded books",
};

export default function BooksRoute() {
  return <BookListPage />;
}
