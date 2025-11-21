# Fase 1: build com Maven
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia o pom primeiro (cache de dependências)
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Copia o código-fonte
COPY src ./src

# Gera o .jar (target/*.jar)
RUN mvn -B clean package -DskipTests

# Fase 2: imagem final só com o JAR
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copia o JAR da fase de build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Comando de start
CMD ["java", "-jar", "app.jar"]
