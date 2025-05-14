export const Footer = () => {
  return (
    <footer className="py-8 border-t w-full">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>
          ©{new Date().getFullYear()} Study Notes. Wszelkie prawa zastrzeżone.
        </p>
      </div>
    </footer>
  );
};
