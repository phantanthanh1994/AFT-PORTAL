export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    // Nếu script đã tồn tại, không load lại
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Không thể tải script: ${src}`));

    document.head.appendChild(script);
  });
};

export const loadMultipleScripts = async (scripts = []) => {
  for (const src of scripts) {
    try {
      await loadScript(src);
    } catch (error) {
      console.error(error.message);
    }
  }
};