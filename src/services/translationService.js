const translateText = async (text, sourceLang, targetLang) => {
  try {
    console.log(`Translating from ${sourceLang} to ${targetLang}: ${text}`);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    
    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    console.log('Translation response:', data);
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Convert language codes from Web Speech API format to MyMemory format
const convertLanguageCode = (code) => {
  switch (code) {
    case 'en-US':
      return 'en';
    case 'es-ES':
      return 'es';
    default:
      return code.split('-')[0];
  }
};

export const translate = async (text, fromLang, toLang) => {
  const sourceLang = convertLanguageCode(fromLang);
  const targetLang = convertLanguageCode(toLang);
  return translateText(text, sourceLang, targetLang);
};

export default {
  translate
};
