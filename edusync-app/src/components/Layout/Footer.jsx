const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/logo.png" alt="Edusync" className="h-6 w-6" />
            <span className="text-sm text-slate-600">© 2026 Edusync. Todos los derechos reservados.</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">Privacidad</a>
            <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">Términos</a>
            <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
