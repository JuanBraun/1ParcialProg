# Aplicación de TDD en 2 Pasos Simples

Para agregar el producto **"Té en hebras"**, en lugar de programar la funcionalidad directamente, aplicamos la metodología **TDD (Test-Driven Development)** escribiendo la prueba antes que el código de producción.

---

## 🔄 Flujo de Trabajo (Red-Green-Refactor)

### 1. 🔴 Fase ROJO (La prueba falla)
* **Acción:** Fuimos al archivo `cafeteria.test.ts` y escribimos un test indicando que un Té debe costar **$1500**.
* **Resultado:** Al ejecutar `npm test`, la prueba dio error (**Rojo**) porque la clase o código del Té todavía no existía.
* **Propósito:** Esta fase sirve para validar que nuestro test realmente detecta cuando falta una funcionalidad o cuándo algo está fallando.

### 2. 🟢 Fase VERDE (La solución mínima)
* **Acción:** Creamos el archivo `te.ts` para solucionar el error reportado por la prueba.
  * Aplicamos **herencia** (`extends Producto`).
  * Aplicamos **polimorfismo** (su método `calcularPrecio()` simplemente devuelve el precio base, sin sumar gramos extra).
* **Resultado:** Al volver a correr `npm test`, la suite de pruebas pasó a **Verde**.

---

## Conclusión

En **TDD el test guía al desarrollo**. Primero definimos qué queríamos lograr y diseñamos la prueba; recién después escribimos el código estricto y necesario en el modelo para que la terminal nos diera el OK.