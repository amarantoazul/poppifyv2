
import React, { useState } from 'react';
import { initialPerfil } from '../../lib/data';
import { Perfil } from '../../lib/types';
import { SaveIcon } from '../icons/Icons';

const PerfilPage: React.FC = () => {
    const [perfil, setPerfil] = useState<Perfil>(initialPerfil);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para guardar el perfil
        alert("Perfil guardado exitosamente!");
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-gray-700 text-3xl font-medium">Perfil de la Florería</h3>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Nombre de la Florería</label>
                            <input type="text" name="nombreFloreria" value={perfil.nombreFloreria} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
                            <input type="tel" name="telefono" value={perfil.telefono} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">WhatsApp</label>
                            <input type="tel" name="whatsapp" value={perfil.whatsapp} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
                            <input type="email" name="correo" value={perfil.correo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <hr className="md:col-span-2 my-4" />

                         <div>
                            <label className="block text-gray-700 font-semibold mb-2">País</label>
                            <input type="text" name="pais" value={perfil.pais} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-gray-700 font-semibold mb-2">Estado</label>
                            <input type="text" name="estado" value={perfil.estado} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label className="block text-gray-700 font-semibold mb-2">Ciudad</label>
                            <input type="text" name="ciudad" value={perfil.ciudad} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Colonia / Poblado</label>
                            <input type="text" name="colonia" value={perfil.colonia} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">Calle y Número</label>
                            <input type="text" name="calle" value={perfil.calle} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-semibold mb-2">URL de Google Maps</label>
                            <input type="url" name="mapsUrl" value={perfil.mapsUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <button type="submit" className="flex items-center px-6 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                           <SaveIcon />
                           <span className="ml-2">Guardar Cambios</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PerfilPage;
