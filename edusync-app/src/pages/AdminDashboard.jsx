const AdminDashboard = () => {
    // ... código anterior ...
    return (
        <div className="p-8">
            <h2 className="text-2xl font-black mb-6">Gestión de Materias (Admin)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario para crear materias */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Nueva Materia</h3>
                    <input type="text" placeholder="Nombre de materia" className="w-full p-3 bg-slate-50 rounded-xl mb-4" />
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Crear Materia</button>
                </div>

                {/* Lista de usuarios para asignarles rol de monitor */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Asignar Materia a Monitor</h3>
                    <select className="w-full p-3 bg-slate-50 rounded-xl mb-4">
                        <option>Seleccionar Monitor...</option>
                    </select>
                    <select className="w-full p-3 bg-slate-50 rounded-xl mb-4">
                        <option>Seleccionar Materia...</option>
                    </select>
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Vincular</button>
                </div>
            </div>
        </div>
    );
};