import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { tipoSensor, tipoDispositivo, tipoAlerta, direcaoAlerta} from "../generated/prisma/client";

async function main() {
  console.log("🌱 Iniciando o seeding do banco de dados...");

  await prisma.alerta.deleteMany();
  await prisma.leitura.deleteMany();
  await prisma.plantacaoSensor.deleteMany();

  await prisma.usuario.deleteMany();
  await prisma.dispositivo.deleteMany();
  await prisma.sensor.deleteMany();

  console.log("🧹 Banco de dados limpo.");

  const user1 = await prisma.usuario.create({
    data: {
      id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      nome: "Carolaine Gamer",
      email: "carolaine@agro.po",
      senha: bcrypt.hashSync("senhaSuperSegura123", 10),
      telefone: "3395785902",
    },
  });

  const user2 = await prisma.usuario.create({
    data: {
      id: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
      nome: "Cybelle Gamer",
      email: "cybelle@agro.tester",
      senha: bcrypt.hashSync("senhaNadaSegura321", 10),
      telefone: "3399039177",
    },
  });

  const sTemp = await prisma.sensor.create({
    data: { id: "c3d4e5f6-a7b8-4c9d-ae1f-2a3b4c5d6e7f", nome: "DHT22 - Sensor de Temperatura", tipo: tipoSensor.temperatura, unidade: "°C", status: true, direcao: direcaoAlerta.ACIMA },
  });

  const sSolo = await prisma.sensor.create({
    data: { id: "d4e5f6a7-b8c9-4dae-8f2a-3b4c5d6e7f8a", nome: "HL-69 - Sensor de Umidade do solo", tipo: tipoSensor.umidade_solo, unidade: "%", status: false },
  });

  const sAr = await prisma.sensor.create({
    data: { id: "e5f6a7b8-c9d0-4eaf-9b3c-4d5e6f7a8b9c", nome: "DHT22 - Sensor de Umidade do Ar", tipo: tipoSensor.umidade_ar, unidade: "%", status: false },
  });

  const sLuz = await prisma.sensor.create({
    data: { id: "f6a7b8c9-d0e1-4fba-ac4d-5e6f7a8b9c0d", nome: "LDR 8MM - Sensor de luz", tipo: tipoSensor.luminosidade, unidade: "%", status: true },
  });

  const disp01 = await prisma.dispositivo.create({
    data: { id: "a7b8c9d0-e1f2-4a3b-8c5d-6e7f8a9b0c1d", nome: "Arduino Mega 2560", tipo: tipoDispositivo.Arduino_Mega, status: true },
  });

  const disp02 = await prisma.dispositivo.create({
    data: { id: "b8c9d0e1-f2a3-4b4c-9d5e-7f8a9b0c1d2e", nome: "Arduino Uno R3", tipo: tipoDispositivo.Arduino_Uno, status: true },
  });

  console.log("Catálogo de sensores e dispositivos criados.");

  const plantacao1 = await prisma.plantacao.create({
    data: {
      id: "d05f1635-3743-48a8-8bb0-1c0b50c3cb7f",
      usuario_id: user1.id,
      dispositivo_id: disp01.id,
      nome: "Lote B - Morango 🍓",
      tipo: "Fruticultura",
      data_inicio: new Date("2026-06-01T10:00:00Z"),
      descricao: "A vida não é um morango",
    },
  });

  await prisma.plantacaoSensor.create({
    data: {
      plantacao_id: plantacao1.id,
      sensor_id: sLuz.id,
      limite_atencao: 25.0,
      limite_critico: 10.0,
    },
  });

  const plantacao2 = await prisma.plantacao.create({
    data: {
      id: "3b0edf35-d1a7-4d88-8b62-d9b7b8531cc6",
      usuario_id: user2.id,
      dispositivo_id: disp02.id,
      nome: "Lote A - Cereja 🍒",
      tipo: "Fruticultura",
      data_inicio: new Date("2026-05-15T08:00:00Z"),
      descricao: "Área experimental de cultivo monitorada",
    },
  });

  await prisma.plantacaoSensor.create({
    data: {
      plantacao_id: plantacao2.id,
      sensor_id: sTemp.id,
      limite_atencao: 30.0,
      limite_critico: 35.0,
    },
  });

  const leitura1 = await prisma.leitura.create({
    data: {
      plantacao_id: plantacao1.id,
      luminosidade: 55.0,
      data_hora: new Date(),
    },
  });

  const leitura2 = await prisma.leitura.create({
    data: {
      plantacao_id: plantacao2.id,
      temperatura: 28.0,
      data_hora: new Date(),
    },
  });

  const leituraCritica = await prisma.leitura.create({
    data: {
      plantacao_id: plantacao2.id,
      temperatura: 36.5,
      data_hora: new Date(),
    },
  });

  await prisma.alerta.create({
    data: {
      leitura_id: leituraCritica.id,
      usuario_id: user2.id,
      tipo: tipoAlerta.Critico,
      mensagem: "Alerta Crítico: Temperatura severa detectada: (36.5°C). Risco de quebra de estresse térmico.",
    },
  });

  console.log("✨ Seeding finalizado com sucesso.");
}

main()
  .catch((erro) => {
    console.error("❌ Erro crítico durante o seed:", erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
