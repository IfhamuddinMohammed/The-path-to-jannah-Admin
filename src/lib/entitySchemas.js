// Central config for the admin's schema-driven CRUD — mirrors the entity
// definitions in the shared Base44 app (base44/entities/*.jsonc) so this admin
// stays in sync with the same backend the public "Path to Jannah" app reads from.

export const ENTITY_SCHEMAS = {
  Hadith: {
    label: "Hadith",
    titleField: "book",
    fields: {
      collection: { type: "string", enum: ["Sahih al-Bukhari", "Sahih Muslim", "Sunan an-Nasa'i", "Sunan Abi Dawood", "Jami` at-Tirmidhi", "Sunan Ibn Majah", "Riyad as-Salihin"], required: true },
      book: { type: "string", required: true },
      hadith_number: { type: "string" },
      narrator: { type: "string" },
      arabic_text: { type: "string", multiline: true, rtl: true, required: true },
      english_text: { type: "string", multiline: true, required: true },
      topic: { type: "string", enum: ["faith", "prayer", "charity", "fasting", "pilgrimage", "family", "akhlaq", "knowledge", "quran", "repentance"], required: true },
    },
  },
  Dua: {
    label: "Dua",
    titleField: "title",
    fields: {
      title: { type: "string", required: true },
      arabic_text: { type: "string", multiline: true, rtl: true, required: true },
      transliteration: { type: "string", multiline: true },
      translation: { type: "string", multiline: true, required: true },
      category: { type: "string", enum: ["morning", "evening", "travel", "protection", "eating", "sleeping", "prayer", "general"], required: true },
      hadith_reference: { type: "string" },
      benefits: { type: "string", multiline: true },
    },
  },
  FAQ: {
    label: "FAQ",
    titleField: "question",
    fields: {
      question: { type: "string", required: true },
      answer: { type: "string", multiline: true, required: true },
      category: { type: "string", enum: ["prayer", "fasting", "family", "finance", "halal-haram", "general"], required: true },
      source_reference: { type: "string" },
    },
  },
  Article: {
    label: "Article",
    titleField: "title",
    fields: {
      title: { type: "string", required: true },
      content: { type: "string", multiline: true, required: true },
      category: { type: "string", enum: ["guidance", "prophets", "sahaba", "morals", "akhlaq", "repentance", "sunnah-habits", "family-parenting", "youth-corner", "charity", "self-development", "consequences", "rewards", "respect", "daily-life"], required: true },
      tags: { type: "array" },
      featured: { type: "boolean" },
      arabic_text: { type: "string", multiline: true, rtl: true },
      image_url: { type: "string" },
    },
  },
  AsmaulHusna: {
    label: "99 Names",
    titleField: "name_english",
    fields: {
      name_arabic: { type: "string", rtl: true, required: true },
      name_english: { type: "string", required: true },
      transliteration: { type: "string", required: true },
      meaning: { type: "string", required: true },
      explanation: { type: "string", multiline: true },
      benefits: { type: "string", multiline: true },
      position: { type: "number", required: true },
    },
  },
  Quote: {
    label: "Quote",
    titleField: "text",
    fields: {
      text: { type: "string", multiline: true, required: true },
      arabic_text: { type: "string", multiline: true, rtl: true },
      source: { type: "string", required: true },
      reference: { type: "string" },
      type: { type: "string", enum: ["quran", "hadith", "scholar", "wisdom"], required: true },
      featured: { type: "boolean" },
    },
  },
  Video: {
    label: "Video",
    titleField: "title",
    fields: {
      title: { type: "string", required: true },
      description: { type: "string", multiline: true },
      video_url: { type: "string", required: true },
      thumbnail_url: { type: "string" },
      category: { type: "string", enum: ["lecture", "reminder", "documentary", "quran", "hadith", "sunnah"], required: true },
      scholar: { type: "string" },
      duration: { type: "string" },
      language: { type: "string", enum: ["arabic", "english", "urdu", "other"] },
      featured: { type: "boolean" },
    },
  },
  Quiz: {
    label: "Quiz",
    titleField: "question",
    fields: {
      question: { type: "string", multiline: true, required: true },
      options: { type: "array", required: true },
      correct_answer: { type: "string", required: true },
      explanation: { type: "string", multiline: true },
      category: { type: "string", enum: ["quran", "hadith", "prophets", "islamic-history", "fiqh", "general"], required: true },
      difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"], required: true },
      source_reference: { type: "string" },
    },
  },
  RomanUrduSurah: {
    label: "Roman Urdu Surah Cache",
    titleField: "surah_name",
    fields: {
      surah_number: { type: "number", required: true },
      surah_name: { type: "string" },
      verses_data: { type: "string", multiline: true, required: true },
    },
  },
};

export const ENTITY_NAMES = Object.keys(ENTITY_SCHEMAS);
