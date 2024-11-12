// Importing All Necessary Packages
require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Creating instances
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Initializing GenAI model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Menu commands object for reference
const menuCommands = {
  "Command Pengingat Kesehatan": [
    "/ingatkan_obat <nama_obat> <waktu>",
    "/ingatkan_olahraga <jenis_olahraga> <waktu>",
    "/ingatkan_periksa_gigi <bulan>",
    "/ingatkan_vitamin <nama_vitamin> <waktu>",
    "/ingatkan_periksa_darah <interval>",
  ],
  "Command Pemantauan Kesehatan": [
    "/monitor_tensi <sistolik>/<diastolik>",
    "/monitor_gula_darah <nilai>",
    "/monitor_kolesterol <nilai>",
    "/monitor_trombosit <nilai>",
    "/monitor_Hb <nilai>",
    "/monitor_MCV <nilai>",
    "/monitor_MCH <nilai>",
    "/monitor_mood <tingkat_mood>",
  ],
  "Command Informasi Penyakit": [
    "/info_covid",
    "/info_diabetes",
    "/info_hypertensi",
    "/info_anemia",
    "/info_asma",
    "/info_kolesterol",
    "/info_obesitas",
    "/info_tbc",
    "/info_hepatitis",
    "/info_kanker",
    "/info_talasemia",
    "/info_gagal_ginjal",
    "/info_jantung",
    "/info_stroke",
  ],
  "Command Konsultasi Gejala": [
    "/konsultasi_gejala <gejala>",
    "/cek_gejala_demam",
    "/cek_gejala_flu",
    "/cek_gejala_covid",
    "/cek_gejala_diare",
    "/cek_gejala_mual",
    "/cek_gejala_sesak_napas",
    "/cek_gejala_lelah",
    "/cek_gejala_sakit_kepala",
    "/cek_gejala_sakit_perut",
    "/cek_gejala_ngilu",
  ],
  "Command Edukasi Kesehatan Umum": [
    "/tips_tidur_nyenyak",
    "/tips_diet_seimbang",
    "/tips_makan_sehat",
    "/tips_meditasi",
    "/tips_minum_air",
    "/tips_olahraga",
    "/tips_manajemen_stres",
    "/tips_jantung_sehat",
    "/tips_gigi_sehat",
    "/tips_kesehatan_mental",
    "/tips_penyembuhan_cepat",
  ],
  "Command Penyebab dan Faktor Risiko": [
    "/penyebab_diabetes",
    "/penyebab_anemia",
    "/penyebab_stroke",
    "/penyebab_hipertensi",
    "/penyebab_kanker",
    "/penyebab_gagal_ginjal",
    "/penyebab_sesak_napas",
    "/faktor_risiko_jantung",
    "/faktor_risiko_stroke",
  ],
  "Command Rekomendasi Makanan dan Nutrisi": [
    "/rekomendasi_makanan_anemia",
    "/rekomendasi_makanan_diabetes",
    "/rekomendasi_makanan_kolesterol",
    "/rekomendasi_makanan_asam_urat",
    "/rekomendasi_makanan_sehat",
    "/rekomendasi_buah_untuk_diet",
    "/rekomendasi_sayuran_sehat",
    "/rekomendasi_makanan_protein",
    "/rekomendasi_makanan_vegetarian",
  ],
  "Command Fakta Kesehatan dan Mitos": [
    "/fakta_kesehatan_tubuh",
    "/fakta_kesehatan_mental",
    "/fakta_tidur",
    "/mitos_vs_fakta_anemia",
    "/mitos_vs_fakta_gula_darah",
    "/mitos_vs_fakta_minyak_kelapa",
    "/mitos_vs_fakta_diet_keto",
    "/fakta_vitamin_c",
    "/fakta_vitamin_d",
  ],
  "Command Pemulihan dan Penyembuhan": [
    "/tips_pemulihan_flu",
    "/tips_pemulihan_pasca_operasi",
    "/tips_pemulihan_covid",
    "/tips_meningkatkan_imun",
    "/cara_mengurangi_demam",
    "/cara_mengatasi_sakit_tenggorokan",
    "/cara_menghilangkan_batuk",
  ],
  "Command Pemantauan Kesehatan Wanita dan Kehamilan": [
    "/ingatkan_tes_kehamilan <tanggal>",
    "/tips_menjaga_kesehatan_hamil",
    "/rekomendasi_makanan_ibu_hamil",
    "/info_menstruasi",
    "/monitor_siklus_menstruasi <hari>",
    "/info_menyusui",
    "/rekomendasi_vitamin_hamil",
  ],
  "Command Pengelolaan Stres dan Kesehatan Mental": [
    "/latihan_pernapasan",
    "/latihan_meditasi",
    "/tips_relaksasi",
    "/tips_mindfulness",
    "/motivasi_harian",
    "/kutipan_motivasi",
    "/tips_tenang_dalam_kondisi_stres",
  ],
  "Command Kontak Rumah Sakit": [
    "/kontak_rs_umum: Menampilkan daftar rumah sakit umum di Kalimantan Barat beserta alamat dan nomor telepon.",
  ],
  "Command lainnya": ["/command_lain"],
};

async function handleKontakRSUmum(message) {
  const prompt = `Berikan daftar rumah sakit umum di Kalimantan Barat, Indonesia, lengkap dengan alamat dan nomor telepon yang dapat dihubungi.`;

  // Memanggil fungsi untuk menghasilkan jawaban dari AI
  await generate(prompt, message);
}

// Fungsi baru untuk menangani perintah /command_lain dengan input fleksibel
async function handleCommandLain(message) {
  const prompt = message.body.replace("/command_lain ", "").trim();
  if (prompt) {
    await generate(prompt, message);
  } else {
    await message.reply(
      "Silakan masukkan perintah tambahan setelah /command_lain. Contoh: /command_lain Saya ingin tahu tentang cara menjaga kesehatan mata."
    );
  }
}

// Functions for handling each specific command
async function handleIngatkanObat(message, namaObat, waktu) {
  await message.reply(
    `Pengingat obat: ${namaObat} pada pukul ${waktu} telah diatur.`
  );
}

async function handleIngatkanOlahraga(message, jenisOlahraga, waktu) {
  await message.reply(
    `Pengingat olahraga: ${jenisOlahraga} pada pukul ${waktu} telah diatur.`
  );
}

async function handleIngatkanPeriksaGigi(message, bulan) {
  await message.reply(
    `Pengingat pemeriksaan gigi pada bulan ${bulan} telah diatur.`
  );
}

async function handleIngatkanVitamin(message, namaVitamin, waktu) {
  await message.reply(
    `Pengingat vitamin: ${namaVitamin} pada pukul ${waktu} telah diatur.`
  );
}

async function handleIngatkanPeriksaDarah(message, interval) {
  await message.reply(
    `Pengingat pemeriksaan darah setiap ${interval} telah diatur.`
  );
}

async function handleMonitorTensi(message, sistolik, diastolik) {
  await message.reply(
    `Pemantauan tensi: ${sistolik}/${diastolik} telah dicatat.`
  );
}

async function handleMonitorGulaDarah(message, nilai) {
  await message.reply(`Pemantauan gula darah: ${nilai} mg/dL telah dicatat.`);
}

async function handleMonitorKolesterol(message, nilai) {
  await message.reply(`Pemantauan kolesterol: ${nilai} mg/dL telah dicatat.`);
}

async function handleMonitorTrombosit(message, nilai) {
  await message.reply(`Pemantauan trombosit: ${nilai} ribu/uL telah dicatat.`);
}

async function handleMonitorHb(message, nilai) {
  await message.reply(
    `Pemantauan hemoglobin (Hb): ${nilai} g/dL telah dicatat.`
  );
}

async function handleMonitorMCV(message, nilai) {
  await message.reply(`Pemantauan MCV: ${nilai} fL telah dicatat.`);
}

async function handleMonitorMCH(message, nilai) {
  await message.reply(`Pemantauan MCH: ${nilai} pg telah dicatat.`);
}

async function handleMonitorMood(message, tingkatMood) {
  await message.reply(`Pemantauan mood: tingkat ${tingkatMood} telah dicatat.`);
}

// Helper functions to display the main menu and handle command inputs
async function showMainMenu(message) {
  let menuText = "Daftar Menu Bot 'Twalkcare' yang Tersedia:\n\n";
  Object.keys(menuCommands).forEach((menu, index) => {
    menuText += `${index + 1}. ${menu}\n`;
  });
  menuText +=
    "\nPilih menu dengan mengetik angka (1-12) untuk melihat perintah.";
  await message.reply(menuText);
}

async function showCommandsForMenu(menuNumber, message) {
  const menuKeys = Object.keys(menuCommands);
  const menuName = menuKeys[menuNumber - 1];
  const commands = menuCommands[menuName];
  let commandText = `Perintah yang tersedia untuk ${menuName}:\n\n`;
  commands.forEach((cmd) => {
    commandText += `- ${cmd}\n`;
  });
  await message.reply(commandText);
}

async function showAbout(message) {
  const aboutText = `
  **Twalkcare** adalah bot WhatsApp yang dirancang untuk memberikan informasi kesehatan yang berguna kepada pengguna. Bot ini dapat membantu dengan berbagai macam perintah seperti:
  - Pengingat kesehatan seperti pengingat obat, olahraga, dan pemeriksaan kesehatan.
  - Pemantauan kesehatan dengan memasukkan data vital seperti tekanan darah, kadar gula darah, dan lainnya.
  - Memberikan informasi tentang berbagai penyakit, edukasi kesehatan, dan mitos kesehatan.
  - Rekomendasi makanan sehat dan tips pemulihan.
  `;
  await message.reply(aboutText);
}

async function generate(prompt, message) {
  try {
    const modifiedPrompt = `Berikan jawaban dalam bahasa Indonesia: ${prompt}`;
    const result = await model.generateContent(modifiedPrompt);
    const text = result.response.text();
    await message.reply(text);
  } catch (error) {
    console.error("Error generating response:", error);
    if (
      error.response &&
      error.response.error &&
      error.response.error.message
    ) {
      console.error("Error message from API:", error.response.error.message);
    }
    await message.reply("Maaf, saya tidak dapat memproses permintaan Anda.");
  }
}

// Event listener for incoming messages
client.on("message", async (message) => {
  const validCommands = Object.values(menuCommands)
    .flat()
    .map((cmd) => cmd.toLowerCase());

  if (message.body.toLowerCase() === "/menu") {
    await showMainMenu(message);
  } else if (/^\d+$/.test(message.body)) {
    const menuNumber = parseInt(message.body);
    if (menuNumber === 12) {
      await handleKontakRSUmum(message);
    } else if (menuNumber >= 1 && menuNumber <= 13) {
      await showCommandsForMenu(menuNumber, message);
    } else {
      await message.reply("Silakan pilih angka antara 1 hingga 12.");
    }
  } else if (message.body.toLowerCase() === "/about") {
    await showAbout(message);
  } else if (message.body.startsWith("/command_lain")) {
    await handleCommandLain(message);
  } else if (message.body.startsWith("/ingatkan_obat")) {
    const match = message.body.match(
      /^\/ingatkan_obat\s+(\S+)\s+(\d{2}:\d{2})$/
    );
    match
      ? await handleIngatkanObat(message, match[1], match[2])
      : await message.reply("Format: /ingatkan_obat <nama_obat> <waktu>");
  } else if (message.body.startsWith("/ingatkan_olahraga")) {
    const match = message.body.match(
      /^\/ingatkan_olahraga\s+(\S+)\s+(\d{2}:\d{2})$/
    );
    match
      ? await handleIngatkanOlahraga(message, match[1], match[2])
      : await message.reply(
          "Format: /ingatkan_olahraga <jenis_olahraga> <waktu>"
        );
  } else if (message.body.startsWith("/ingatkan_periksa_gigi")) {
    const match = message.body.match(/^\/ingatkan_periksa_gigi\s+(\S+)$/);
    match
      ? await handleIngatkanPeriksaGigi(message, match[1])
      : await message.reply("Format: /ingatkan_periksa_gigi <bulan>");
  } else if (message.body.startsWith("/ingatkan_vitamin")) {
    const match = message.body.match(
      /^\/ingatkan_vitamin\s+(\S+)\s+(\d{2}:\d{2})$/
    );
    match
      ? await handleIngatkanVitamin(message, match[1], match[2])
      : await message.reply("Format: /ingatkan_vitamin <nama_vitamin> <waktu>");
  } else if (message.body.startsWith("/ingatkan_periksa_darah")) {
    const match = message.body.match(/^\/ingatkan_periksa_darah\s+(\S+)$/);
    match
      ? await handleIngatkanPeriksaDarah(message, match[1])
      : await message.reply("Format: /ingatkan_periksa_darah <interval>");
  } else if (message.body.startsWith("/monitor_tensi")) {
    const match = message.body.match(
      /^\/monitor_tensi\s+(\d{2,3})\/(\d{2,3})$/
    );
    match
      ? await handleMonitorTensi(message, match[1], match[2])
      : await message.reply("Format: /monitor_tensi <sistolik>/<diastolik>");
  } else if (message.body.startsWith("/monitor_gula_darah")) {
    const match = message.body.match(/^\/monitor_gula_darah\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorGulaDarah(message, match[1])
      : await message.reply("Format: /monitor_gula_darah <nilai>");
  } else if (message.body.startsWith("/monitor_kolesterol")) {
    const match = message.body.match(/^\/monitor_kolesterol\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorKolesterol(message, match[1])
      : await message.reply("Format: /monitor_kolesterol <nilai>");
  } else if (message.body.startsWith("/monitor_trombosit")) {
    const match = message.body.match(/^\/monitor_trombosit\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorTrombosit(message, match[1])
      : await message.reply("Format: /monitor_trombosit <nilai>");
  } else if (message.body.startsWith("/monitor_Hb")) {
    const match = message.body.match(/^\/monitor_Hb\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorHb(message, match[1])
      : await message.reply("Format: /monitor_Hb <nilai>");
  } else if (message.body.startsWith("/monitor_MCV")) {
    const match = message.body.match(/^\/monitor_MCV\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorMCV(message, match[1])
      : await message.reply("Format: /monitor_MCV <nilai>");
  } else if (message.body.startsWith("/monitor_MCH")) {
    const match = message.body.match(/^\/monitor_MCH\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorMCH(message, match[1])
      : await message.reply("Format: /monitor_MCH <nilai>");
  } else if (message.body.startsWith("/monitor_mood")) {
    const match = message.body.match(/^\/monitor_mood\s+(\d+(\.\d+)?)$/);
    match
      ? await handleMonitorMood(message, match[1])
      : await message.reply("Format: /monitor_mood <tingkat_mood>");
  } else if (message.body.startsWith("/")) {
    const command = message.body.toLowerCase().split(" ")[0];

    if (validCommands.includes(command)) {
      // Jika perintah valid, proses sesuai
      await generate(message.body, message);
    } else {
      await message.reply(
        "Perintah salah atau format tidak sesuai. Silakan cek kembali."
      );
    }
  }
});

// Event listener for QR code generation
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Event listener for client readiness
client.on("ready", () => {
  console.log("WhatsApp bot is ready!");
});

// Initializing the client
client.initialize();
