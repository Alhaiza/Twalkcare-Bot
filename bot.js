// Importing All Necessary Packages
require("dotenv").config(); // Add this line to load .env variables
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Creating instances
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Use environment variable
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Initializing GenAI model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Defining menu and commands
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
};

// Function to display the 12 main menu options
async function showMainMenu(message) {
  let menuText = "Daftar Menu Bot 'Twalkcare' yang Tersedia:\n\n";

  // Show only the 12 main menu items (removes the numbering)
  const menuKeys = Object.keys(menuCommands);
  menuKeys.forEach((menu, index) => {
    menuText += `${index + 1}. ${menu}\n`;
  });

  menuText +=
    "\nPilih menu dengan mengetik angka (1-12) untuk melihat perintah.";

  // Send the formatted main menu to the user
  await message.reply(menuText);
}

// Function to display the commands for a specific menu
async function showCommandsForMenu(menuNumber, message) {
  const menuKeys = Object.keys(menuCommands); // Get the array of menu names
  const menuName = menuKeys[menuNumber - 1]; // Access the menu based on number
  const commands = menuCommands[menuName];

  let commandText = `Perintah yang tersedia untuk ${menuName}:\n\n`;

  // List all commands for the selected menu
  commands.forEach((cmd) => {
    commandText += `- ${cmd}\n`;
  });

  // Send the commands to the user
  await message.reply(commandText);
}

// Function to handle /about command
async function showAbout(message) {
  const aboutText = `
  **Twalkcare** adalah bot WhatsApp yang dirancang untuk memberikan informasi kesehatan yang berguna kepada pengguna. Bot ini dapat membantu dengan berbagai macam perintah seperti:
  - Pengingat kesehatan seperti pengingat obat, olahraga, dan pemeriksaan kesehatan.
  - Pemantauan kesehatan dengan memasukkan data vital seperti tekanan darah, kadar gula darah, dan lainnya.
  - Memberikan informasi tentang berbagai penyakit, edukasi kesehatan, dan mitos kesehatan.
  - Rekomendasi makanan sehat dan tips pemulihan.

  Dengan bot ini, Anda dapat mengakses berbagai informasi medis yang bermanfaat dengan mudah. Cukup pilih menu dan masukkan perintah yang sesuai untuk mendapatkan informasi yang Anda butuhkan.
  `;
  await message.reply(aboutText);
}

async function generate(prompt, message) {
  try {
    // Modify prompt for generating the response in Bahasa Indonesia
    const modifiedPrompt = `Berikan jawaban dalam bahasa Indonesia: ${prompt}`;
    const result = await model.generateContent(modifiedPrompt);
    const response = result.response;
    const text = response.text();

    await message.reply(text); // Reply to user
  } catch (error) {
    console.error("Error generating response:", error);
    await message.reply("Maaf, saya tidak dapat memproses permintaan Anda.");
  }
}

// Event listeners for client status
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("Client is authenticated!");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("disconnected", () => {
  console.log("Client is disconnected!");
});

client.on("auth_failure", () => {
  console.log("Client authentication failed!");
});

// Event listener for messages
client.on("message", async (message) => {
  console.log(`Received message: ${message.body}`); // Log user message to the terminal

  // Check if the message is a valid command or number
  const validCommands = Object.values(menuCommands)
    .flat()
    .map((cmd) => cmd.toLowerCase());

  // Handle the /menu and /about commands, or commands from the menu
  if (message.body.toLowerCase() === "/menu") {
    await showMainMenu(message);
  } else if (message.body.toLowerCase() === "/about") {
    await showAbout(message);
  } else if (/^\d+$/.test(message.body)) {
    // Allow any number of digits
    const menuNumber = parseInt(message.body);
    if (menuNumber >= 1 && menuNumber <= 12) {
      await showCommandsForMenu(menuNumber, message);
    } else {
      await message.reply("Silakan pilih angka antara 1 hingga 12.");
    }
  } else if (validCommands.includes(message.body.toLowerCase())) {
    // Handle valid command
    await generate(message.body, message);
  } else {
    // If the command is not valid, don't respond
    await message.reply(
      "Perintah tidak dikenali. Silakan pilih perintah yang valid."
    );
  }
});

// Initialize client
client.initialize();
