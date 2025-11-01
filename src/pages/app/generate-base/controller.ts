// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import z from "zod";

// const createGenerateBaseSchema = z.object({
//   type: z.enum(["fixo", "movel", "indiferente"]),
//   ddd: z.enum(["todos", "lista"]),
//   portate: z.enum(["sim", "nao", "indiferente"]),
//   date_portability: z.string(),
//   operator_origem: z.enum(["lista", "indiferente"]),
//   operator_now: z.enum(["lista", "indiferente"]),
// });

// export type GenerateBaseForm = z.infer<typeof createGenerateBaseSchema>;

// export function useGenerateBaseController() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     control,
//   } = useForm<GenerateBaseForm>({
//     resolver: zodResolver(createGenerateBaseSchema),
//   });

//   const [generateBase, setGenerateBase] = useState<GenerateBaseForm[]>([]);

//   function onSubmit(data: GenerateBaseForm) {
//     console.log(data);

//     setGenerateBase([
//       {
//         type: data.type,
//         ddd: data.ddd,
//         portate: data.portate,
//         date_portability: data.date_portability,
//         operator_now: data.operator_now,
//         operator_origem: data.operator_origem,
//       },
//     ]);

//     reset();
//   }

//   console.log(generateBase);

//   return {
//     hookForm: {
//       register,
//       handleSubmit,
//       errors,
//       onSubmit,
//       control,
//     },
//     generateBase,
//   };
// }

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const createGenerateBaseSchema = z.object({
  type: z.enum(["fixo", "movel", "indiferente"]),
  ddd: z.enum(["todos", "lista"]),
  portate: z.enum(["sim", "não", "indiferente"]),
  date_portability: z.string().optional(),
  operator_origem: z.enum(["lista", "indiferente"]),
  operator_now: z.enum(["lista", "indiferente"]),
  uf: z.enum(["todos", "lista"]).optional(),
  citys: z.enum(["todos", "lista"]).optional(),
  date_portability_from: z.string().optional(),
  date_portability_to: z.string().optional(),
});

export type GenerateBaseForm = z.infer<typeof createGenerateBaseSchema>;

// Tipo para os dados da tabela
export type PhoneData = {
  ddd: string;
  number: string;
  anatel: string;
  type: string;
  operatorOrigem: string;
  operatorNow: string;
  portate: boolean;
  datePortate: string;
  municipalityRegion: string;
  uf: string;
};

// Dados fictícios para gerar exemplos
const operators = [
  "TIM S.A.",
  "CLARO S.A.",
  "TELEFÔNICA BRASIL S.A.",
  "OI S.A.",
  "ALGAR TELECOM S/A",
  "SERCOMTEL S.A.",
];

const cities = [
  { city: "São Paulo", uf: "SP", ddd: "11" },
  { city: "Rio de Janeiro", uf: "RJ", ddd: "21" },
  { city: "Belo Horizonte", uf: "MG", ddd: "31" },
  { city: "Brasília", uf: "DF", ddd: "61" },
  { city: "Salvador", uf: "BA", ddd: "71" },
  { city: "Curitiba", uf: "PR", ddd: "41" },
  { city: "Porto Alegre", uf: "RS", ddd: "51" },
  { city: "Goiânia", uf: "GO", ddd: "62" },
];

function generatePhoneNumber(type: string): string {
  if (type === "fixo" || type === "Fixo") {
    // Fixo: 3XXX-XXXX ou 2XXX-XXXX
    const prefix = Math.random() > 0.5 ? "3" : "2";
    return prefix + Math.floor(Math.random() * 9000000 + 1000000);
  } else {
    // Móvel: 9XXXX-XXXX
    return "9" + Math.floor(Math.random() * 90000000 + 10000000);
  }
}

function generateDate(): string {
  const year = 2023 + Math.floor(Math.random() * 2);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${day}/${month}/${year}`;
}

function generateMockData(
  filters: GenerateBaseForm,
  count: number = 15
): PhoneData[] {
  const data: PhoneData[] = [];

  for (let i = 0; i < count; i++) {
    // Determinar tipo baseado no filtro
    let phoneType: string;
    if (filters.type === "indiferente") {
      phoneType = Math.random() > 0.5 ? "Móvel" : "Fixo";
    } else {
      phoneType = filters.type === "movel" ? "Móvel" : "Fixo";
    }

    // Determinar se é portado
    let isPortate: boolean;
    if (filters.portate === "indiferente") {
      isPortate = Math.random() > 0.5;
    } else {
      isPortate = filters.portate === "sim";
    }

    // Selecionar cidade aleatória
    const cityData = cities[Math.floor(Math.random() * cities.length)];

    // Gerar operadoras
    const operOrigem = operators[Math.floor(Math.random() * operators.length)];
    let operNow: string;

    if (isPortate) {
      // Se portado, garantir operadora diferente
      do {
        operNow = operators[Math.floor(Math.random() * operators.length)];
      } while (operNow === operOrigem);
    } else {
      operNow = operOrigem;
    }

    data.push({
      ddd: cityData.ddd,
      number: generatePhoneNumber(phoneType),
      anatel: Math.floor(Math.random() * 90000000 + 10000000).toString(),
      type: phoneType,
      operatorOrigem: operOrigem,
      operatorNow: operNow,
      portate: isPortate,
      datePortate: isPortate ? generateDate() : "",
      municipalityRegion: cityData.city,
      uf: cityData.uf,
    });
  }

  return data;
}

export function useGenerateBaseController() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<GenerateBaseForm>({
    resolver: zodResolver(createGenerateBaseSchema),
  });

  const [phoneData, setPhoneData] = useState<PhoneData[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  function onSubmit(data: GenerateBaseForm) {
    console.log("Filtros aplicados:", data);

    // Gerar dados fictícios baseados nos filtros
    const mockData = generateMockData(data);
    setPhoneData(mockData);
    setHasGenerated(true);

    console.log("Dados gerados:", mockData);
  }

  function clearData() {
    setPhoneData([]);
    setHasGenerated(false);
    reset();
  }

  return {
    hookForm: {
      register,
      handleSubmit,
      errors,
      onSubmit,
      control,
      watch,
    },
    phoneData,
    hasGenerated,
    clearData,
  };
}
