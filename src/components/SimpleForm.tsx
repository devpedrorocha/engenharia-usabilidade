import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema for the form
const formSchema = z.object({
  titulo: z.string().min(1, "Título do trabalho é obrigatório"),
  resumo: z.string().min(1, "Resumo é obrigatório"),
  anexos: z.any().refine((files) => files?.length > 0, "Anexos são obrigatórios"),
});

const SimpleForm: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    window.location.href = "/submetido";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  return (
    <div className="p-6 bg-white rounded-lg space-y-6 w-[80%] mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título do Trabalho</label>
          <input
            {...register("titulo")}
            type="text"
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.titulo && <p className="text-red-500 text-sm">{errors.titulo.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Resumo</label>
          <textarea
            {...register("resumo")}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.resumo && <p className="text-red-500 text-sm">{errors.resumo.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Anexos</label>
          <div className="relative mt-1">
            <input
              {...register("anexos")}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex items-center justify-center w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
              <span className="text-gray-500">
                {selectedFiles
                  ? `${selectedFiles.length} arquivo(s) selecionado(s)`
                  : "Selecione os arquivos"}
              </span>
            </div>
          </div>
          {selectedFiles && (
            <ul className="mt-2 space-y-1">
              {Array.from(selectedFiles).map((file, index) => (
                <li key={index} className="text-gray-700 text-sm">
                  {file.name}
                </li>
              ))}
            </ul>
          )}
          {errors.anexos && <p className="text-red-500 text-sm">{errors.anexos.message}</p>}
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submeter
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimpleForm;
