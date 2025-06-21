export interface PersonalizedPlanInput {
  fullName?: string;
  age: number;
  sexo: string;
  altura: number;
  peso: number;
  imc?: number;
  objetivo: string;
  plazo?: string;
  condiciones_medicas?: string;
  alergias?: string;
  preferencias_nutricionales?: string;
  habitos_alimenticios?: string;
  nivel_actividad_actual?: string;
  nivel_entrenamiento?: string;
  sesiones_semana?: string;
  minutos_por_sesion?: string;
  equipamiento_disponible?: string;
  horario_entrenamiento?: string;
  horario_comidas?: string;
  presupuesto_semana?: string;
  estres?: string;
  sueno?: string;
  motivadores?: string;
  cookingAvailability?: string;
  personalPriorities?: string;
  nutritionKnowledge?: string;
}

export interface PersonalizedPlanOutput {
  planNutricional: {
    mensajeIntroductorio: string;
    desgloseMacros: {
      caloriasTotales: string;
      proteinas: string;
      carbohidratos: string;
      grasas: string;
    };
    distribucionComidas: string;
    ejemplosRecetasPlatos: {
      tipoComida: string;
      opciones: string[];
    }[];
    consejosPreparacionTiming: string;
  };
  programaEntrenamiento: {
    tipoEjercicio: string;
    frecuenciaVolumenSemanal: string;
    ejerciciosDetalladosPorSesion: {
      nombreSesion: string;
      descripcionSesion?: string;
      ejercicios: {
        nombreEjercicio: string;
        seriesRepeticiones: string;
        descanso: string;
        alternativaOpcional?: string;
      }[];
    }[];
    opcionesAlternativas?: string;
  };
  sugerenciasSeguimientoAjustes: {
    indicadoresProgreso: string;
    frecuenciaRevisionesModificaciones: string;
    estrategiasMotivacionAdherencia: string;
    mensajeFinalMotivador: string;
  };
}
