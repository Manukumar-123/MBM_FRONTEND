const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} My Company. All rights reserved.
        </p>
        <p>
          Follow us on
          <a href="https://twitter.com" className="text-blue-400 ml-2">
            Twitter
          </a>
          ,
          <a href="https://facebook.com" className="text-blue-600 ml-2">
            Facebook
          </a>
          , and
          <a href="https://instagram.com" className="text-pink-500 ml-2">
            Instagram
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
export default Footer;
