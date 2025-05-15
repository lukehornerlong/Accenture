import Navbar from "../components/navbar/navbar";

const CVPage = () => {
  const pdfUrl =
    "https://docs.google.com/file/d/1weFlUcNuvndGfr2D16qjuhBn3N7ICNzP/edit?usp=docslist_api&filetype=msword";
  return (
    <div>
      <Navbar />
      <iframe
        title="Embedded PDF"
        src={pdfUrl}
        width="100%"
        height="500px"
      ></iframe>
    </div>
  );
};

export default CVPage;
