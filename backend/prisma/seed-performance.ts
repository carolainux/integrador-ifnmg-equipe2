import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { tipoSensor, tipoDispositivo, direcaoAlerta} from "../generated/prisma/client";

const intervaloMinutos = 2;
const diasSimulados = 90;
const totalCiclos = (diasSimulados * 24 * 60) / intervaloMinutos;
const tamanhoBloco = 5000;

function gerarValorMetricoAleatorio(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

async function main() {
  console.log("🌱 Iniciando seeding de performance...");

  await prisma.alerta.deleteMany();
  await prisma.leitura.deleteMany();
  await prisma.plantacaoSensor.deleteMany();
  await prisma.plantacao.deleteMany();
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
    data: { id: "d4e5f6a7-b8c9-4dae-8f2a-3b4c5d6e7f8a", nome: "HL-69 - Sensor de Umidade do solo", tipo: tipoSensor.umidade_solo, unidade: "%", status: true },
  });

  const sAr = await prisma.sensor.create({
    data: { id: "e5f6a7b8-c9d0-4eaf-9b3c-4d5e6f7a8b9c", nome: "DHT22 - Sensor de Umidade do Ar", tipo: tipoSensor.umidade_ar, unidade: "%", status: true },
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

  await prisma.plantacaoSensor.createMany({
    data: [
      { plantacao_id: plantacao1.id, sensor_id: sLuz.id, limite_atencao: 25.0, limite_critico: 10.0 },
      { plantacao_id: plantacao1.id, sensor_id: sSolo.id, limite_atencao: 40.0, limite_critico: 20.0 },
    ],
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

  await prisma.plantacaoSensor.createMany({
    data: [
      { plantacao_id: plantacao2.id, sensor_id: sTemp.id, limite_atencao: 30.0, limite_critico: 35.0 },
      { plantacao_id: plantacao2.id, sensor_id: sAr.id, limite_atencao: 60.0, limite_critico: 80.0 },
    ],
  });

  const idsPlantacoes = [plantacao1.id, plantacao2.id];
  const dataInicioSimulacao = new Date();
  dataInicioSimulacao.setDate(dataInicioSimulacao.getDate() - diasSimulados);

  console.log("\nMétricas de Carga Calculadas:");
  console.log(`- Registros por plantação: ${totalCiclos}`);
  console.log(`- Carga consolidada total na tabela Leitura: ${totalCiclos * idsPlantacoes.length} registros.`);

  for (const plantacaoId of idsPlantacoes) {
    console.log(`\nInjetando dados em lote para Plantacao ID: ${plantacaoId}...`);
    const blocoDeDados: any[] = [];

    for (let i = 0; i < totalCiclos; i++) {
      const dataHoraLeitura = new Date(dataInicioSimulacao.getTime() + i * intervaloMinutos * 60 * 1000);

      const leitura: any = { plantacao_id: plantacaoId, data_hora: dataHoraLeitura };
      if (plantacaoId === plantacao1.id) {
        leitura.luminosidade = gerarValorMetricoAleatorio(10, 100);
        leitura.umidade_solo = gerarValorMetricoAleatorio(12, 88);
      } else {
        leitura.temperatura = gerarValorMetricoAleatorio(16, 41);
        leitura.umidade_ar = gerarValorMetricoAleatorio(15, 80);
      }
      blocoDeDados.push(leitura);

      if (blocoDeDados.length === tamanhoBloco || i === totalCiclos - 1) {
        await prisma.leitura.createMany({ data: blocoDeDados });
        console.log(`Bloco de ${blocoDeDados.length} leituras inserido.`);
        blocoDeDados.length = 0;
      }
    }
  }

  console.log("✨ Seeding de performance finalizado com sucesso.");
}

main()
  .catch((erro) => {
    console.error("❌ Erro crítico durante o seed:", erro);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
