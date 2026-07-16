export const translatePage = async (lang: string) => {
  if (typeof window === 'undefined' || !lang) return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;


  if (lang === 'tr') {
    while ((node = walker.nextNode())) {
      if ((node as any).originalText) {
        node.nodeValue = (node as any).originalText;
      }
    }
    return;
  }
  
  const nodesToTranslate: { node: any; text: string; cacheKey: string }[] = [];


  while ((node = walker.nextNode())) {
    if (!(node as any).originalText) {
      const initialText = node.nodeValue?.trim();
      if (!initialText || initialText.length < 2 || !isNaN(Number(initialText))) continue;

      const parentTag = node.parentElement?.tagName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'OPTION' || parentTag === 'TEXTAREA') continue;

      (node as any).originalText = initialText;
    }

    const text = (node as any).originalText;
    const cacheKey = `real_ai_${lang}_${text}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached && !cached.includes('INVALID SOURCE LANGUAGE')) {
      node.nodeValue = cached;
    } else {
      nodesToTranslate.push({ node, text, cacheKey });
    }
  }

  if (nodesToTranslate.length === 0) return;

  console.log(`⚡ ${nodesToTranslate.length} adet metin paralel olarak jet hızında çevriliyor...`);

 
  const translationPromises = nodesToTranslate.map(async (item) => {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.text)}&langpair=tr|${lang}`
      );
      const data = await response.json();

      if (data?.responseData?.translatedText) {
        const translatedResult = data.responseData.translatedText;
        
        if (!translatedResult.includes('INVALID SOURCE LANGUAGE')) {
          localStorage.setItem(item.cacheKey, translatedResult);
          item.node.nodeValue = translatedResult; 
        }
      }
    } catch (error) {
      console.error("Çeviri hatası:", error);
    }
  });

  await Promise.all(translationPromises);
  console.log("🚀 Sayfadaki tüm yazılar eşzamanlı olarak başarıyla çevrildi!");
};