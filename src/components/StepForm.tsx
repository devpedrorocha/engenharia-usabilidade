import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema for each step
const stepSchemas = [
  z.object({
    nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().email("E-mail inválido"),
    telefone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
    dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    termos: z.boolean().refine((val) => val, "Você deve aceitar os termos"),
  }),
  z.object({
    universidade: z.string().optional(),
    tipoUsuario: z.string().min(1, "Selecione o tipo de usuário"),
  }),
  z.object({
    atividades: z.array(z.string()).min(1, "Selecione ao menos uma atividade"),
  }),
];

// Steps configuration
const steps = [
  {
    label: "Dados Pessoais",
    inputs: [
      { name: "nomeCompleto", label: "Nome Completo", type: "input" },
      { name: "email", label: "E-mail", type: "input" },
      { name: "telefone", label: "Telefone", type: "input" },
      { name: "dataNascimento", label: "Data de Nascimento", type: "date" },
      { name: "termos", label: "Li e concordo com os termos de uso", type: "checkbox" },
    ],
  },
  {
    label: "Forma de Inscrição",
    inputs: [
      {
        name: "universidade",
        label: "Está associado a alguma universidade? Se sim, especifique.",
        type: "input",
      },
      {
        name: "tipoUsuario",
        label: "Tipo de Usuário",
        type: "select",
        options: ["Estudante", "Professor", "Técnico Administrativo", "Público Geral"],
      },
    ],
  },
  {
    label: "Atividades",
    inputs: [
      {
        name: "atividades",
        label: "Atividades que deseja participar",
        type: "select",
        options: ["24/11 08:00 - Palestra", "25/11 08:00 - Workshop", "26/11 08:00 - Mesa Redonda"],
      },
    ],
  },
];

const StepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    unregister,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      telefone: "",
      dataNascimento: "",
      termos: false,
      tipoInscricao: "",
      atividades: [],
    },
  });

  const selectedActivities = watch("atividades");

  const handleAddActivity = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value && !selectedActivities.includes(value)) {
      setValue("atividades", [...selectedActivities, value]);
    }
  };

  const handleRemoveActivity = (activity: string) => {
    setValue(
      "atividades",
      selectedActivities.filter((a: string) => a !== activity)
    );
  };

  const onSubmit = (data: any) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      window.location.href = "/inscrito";
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="p-6 bg-white rounded-lg space-y-6">
      {/* Stepper */}
      <div className="w-[500px] mx-auto relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <div
              className={`relative z-10 flex items-center justify-center h-12 w-12 rounded-full border-2 text-lg ${
                index <= currentStep
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "bg-white border-gray-300"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${index <= currentStep ? "text-blue-600" : "text-gray-400"}`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-6 left-1/2 transform -translate-x-1/2 h-px w-full transition-all duration-500 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
        <div
          className="absolute top-6 left-0 h-px bg-blue-600 z-0 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 2 ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Selecione uma Atividade
            </label>
            <select
              onChange={handleAddActivity}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Escolha uma atividade</option>
              {steps[2].inputs[0].options
                .filter((activity) => !selectedActivities.includes(activity))
                .map((activity, index) => (
                  <option key={index} value={activity}>
                    {activity}
                  </option>
                ))}
            </select>
            {errors.atividades && (
              <p className="text-sm text-red-600 mt-1">{errors.atividades.message}</p>
            )}

            {/* Added Activities Preview */}
            <div className="mt-4 space-y-2">
              {selectedActivities.map((activity: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50"
                >
                  <span>{activity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(activity)}
                    className="text-red-500 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          steps[currentStep].inputs.map((input, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700">{input.label}</label>
              {input.type === "input" && (
                <input
                  {...register(input.name)}
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              {input.type === "date" && (
                <input
                  {...register(input.name)}
                  type="date"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              {input.type === "checkbox" && (
                <input {...register(input.name)} type="checkbox" className="mt-1 size-5" />
              )}
              {input.type === "select" && (
                <select
                  {...register(input.name)}
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione</option>
                  {input.options!.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {errors[input.name] && (
                <p className="text-red-500 text-sm">{errors[input.name]?.message}</p>
              )}
            </div>
          ))
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className={`px-4 py-2 bg-gray-300 text-gray-700 rounded-md ${
              currentStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
            }`}
          >
            Anterior
          </button>
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              currentStep === steps.length - 1 ? "hover:bg-blue-700" : "hover:bg-blue-500"
            }`}
          >
            {currentStep === steps.length - 1 ? "Enviar" : "Próximo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepForm;
