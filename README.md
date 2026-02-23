<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ⚡ Ohm's Adventure — Simulador Interactivo de Electrónica Básica

Simulador educativo de la **Ley de Ohm** (V = I × R) con animación de electrones y explicaciones con inteligencia artificial.

🌐 **Ver en línea:** https://josecarlsanta.github.io/Pruebas_Clases_Simulaciones/

---

## 🚀 Cómo ejecutarlo localmente

**Requisitos previos:** Tener [Node.js](https://nodejs.org) instalado.

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/josecarlsanta/Pruebas_Clases_Simulaciones.git
   cd Pruebas_Clases_Simulaciones
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. (Opcional) Configurar la clave de la API de Gemini para habilitar las explicaciones de IA:
   - Copia el archivo `.env.local` y agrega tu clave:
   ```
   GEMINI_API_KEY=tu_clave_aqui
   ```
   - Obtén tu clave gratis en: https://aistudio.google.com/app/apikey

4. Iniciar la aplicación:
   ```bash
   npm run dev
   ```

5. Abrir en el navegador: **http://localhost:3000**

---

## 🎮 ¿Cómo usar el simulador?

| Elemento | Descripción |
|---|---|
| 🔵 Animación de electrones | Visualiza el flujo de corriente en el circuito |
| ⚡ Control de Voltaje | Ajusta el voltaje (V) con el deslizador azul |
| 🔴 Control de Resistencia | Ajusta la resistencia (Ω) con el deslizador rojo |
| 📐 Fórmula dinámica | Muestra V = I × R actualizado en tiempo real |
| 🤖 Botón de IA | El "Profesor" explica la situación actual del circuito |

---

## 🛠️ Tecnologías utilizadas

- **React 19** + **TypeScript**
- **Vite 6** (servidor de desarrollo y compilación)
- **Google Gemini AI** (explicaciones educativas)
- **GitHub Actions** (despliegue automático)
- **GitHub Pages** (publicación web gratuita)
