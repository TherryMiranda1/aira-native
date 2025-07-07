import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { PersonalizedPlanOutput } from "@/types/Assistant";
import {
  ContentCard,
  ContentSection,
  ContentText,
  ContentList,
} from "./ContentCard";
import { ThemedView } from "@/components/ThemedView";

interface CompletePlanCardProps {
  completePlan: PersonalizedPlanOutput;
}

export function CompletePlanCard({ completePlan }: CompletePlanCardProps) {
  return (
    <ContentCard
      title="Plan Completo de Bienestar"
      subtitle="Tu plan personalizado integral"
      description="Un plan completo diseñado especialmente para ti"
      icon="🌟"
      variant="success"
    >
      {/* Plan Nutricional */}
      <ContentSection title="Plan Nutricional" icon="🥗">
        <ContentText variant="highlight">
          {completePlan.planNutricional.mensajeIntroductorio}
        </ContentText>

        <View style={styles.macrosContainer}>
          <ThemedText type="defaultSemiBold" style={styles.macrosTitle}>
            📊 Desglose Nutricional:
          </ThemedText>
          <View style={styles.macrosGrid}>
            <View style={styles.macroItem}>
              <ThemedText type="small" style={styles.macroLabel}>
                Calorías
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.macroValue}>
                {completePlan.planNutricional.desgloseMacros.caloriasTotales}
              </ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText type="small" style={styles.macroLabel}>
                Proteínas
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.macroValue}>
                {completePlan.planNutricional.desgloseMacros.proteinas}
              </ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText type="small" style={styles.macroLabel}>
                Carbohidratos
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.macroValue}>
                {completePlan.planNutricional.desgloseMacros.carbohidratos}
              </ThemedText>
            </View>
            <View style={styles.macroItem}>
              <ThemedText type="small" style={styles.macroLabel}>
                Grasas
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.macroValue}>
                {completePlan.planNutricional.desgloseMacros.grasas}
              </ThemedText>
            </View>
          </View>
        </View>

        {completePlan.planNutricional.ejemplosRecetasPlatos && (
          <View style={styles.mealsSection}>
            {completePlan.planNutricional.ejemplosRecetasPlatos.map(
              (comida, index) => (
                <View key={index} style={styles.mealItem}>
                  <ThemedText type="defaultSemiBold" style={styles.mealType}>
                    {comida.tipoComida}
                  </ThemedText>
                  <ContentList
                    items={comida.opciones.slice(0, 2)}
                    type="bullet"
                  />
                </View>
              )
            )}
          </View>
        )}
      </ContentSection>

      {/* Plan de Ejercicio */}
      <ContentSection title="Programa de Entrenamiento" icon="💪">
        <ContentText variant="highlight">
          Tipo: {completePlan.programaEntrenamiento.tipoEjercicio}
        </ContentText>

        <ContentText variant="highlight">
          Frecuencia:{" "}
          {completePlan.programaEntrenamiento.frecuenciaVolumenSemanal}
        </ContentText>

        {completePlan.programaEntrenamiento.ejerciciosDetalladosPorSesion && (
          <View style={styles.routinesSection}>
            {completePlan.programaEntrenamiento.ejerciciosDetalladosPorSesion.map(
              (sesion, index) => (
                <ThemedView
                  key={index}
                  variant="border"
                  style={styles.routineItem}
                >
                  <ThemedText type="defaultSemiBold" style={styles.routineName}>
                    {sesion.nombreSesion}
                  </ThemedText>
                  {sesion.descripcionSesion && (
                    <ContentText>{sesion.descripcionSesion}</ContentText>
                  )}
                  <ContentList
                    items={sesion.ejercicios
                      .slice(0, 3)
                      .map(
                        (ej) =>
                          `${ej.nombreEjercicio} - ${ej.seriesRepeticiones}`
                      )}
                    type="bullet"
                  />
                  {sesion.ejercicios.length > 3 && (
                    <ContentText variant="highlight">
                      + {sesion.ejercicios.length - 3} ejercicios más
                    </ContentText>
                  )}
                </ThemedView>
              )
            )}
          </View>
        )}
      </ContentSection>

      {/* Seguimiento y Ajustes */}
      <ContentSection title="Seguimiento y Motivación" icon="📈">
        <ContentText variant="highlight">
          {completePlan.sugerenciasSeguimientoAjustes.indicadoresProgreso}
        </ContentText>

        <ContentText>
          Revisiones:{" "}
          {
            completePlan.sugerenciasSeguimientoAjustes
              .frecuenciaRevisionesModificaciones
          }
        </ContentText>

        <ContentText variant="highlight">
          {completePlan.sugerenciasSeguimientoAjustes.mensajeFinalMotivador}
        </ContentText>
      </ContentSection>
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  macrosContainer: {
    marginVertical: 12,
  },
  macrosTitle: {
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  macroItem: {
    padding: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  macroLabel: {
    color: AiraColors.mutedForeground,
  },
  macroValue: {
    color: AiraColors.primary,
  },
  mealsSection: {
    marginTop: 12,
    gap: 8,
  },
  mealItem: {
    padding: 8,
    borderRadius: 6,
  },
  mealType: {
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  routinesSection: {
    marginTop: 12,
    gap: 8,
  },
  routineItem: {
    padding: 8,
    borderRadius: 6,
  },
  routineName: {
    color: AiraColors.foreground,
    marginBottom: 4,
  },
});
