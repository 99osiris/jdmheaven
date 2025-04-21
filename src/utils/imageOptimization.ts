export const getImageDimensions = (src: string) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = src;
  });
};

export const optimizeImageUrl = (url: string, width?: number, quality = 80) => {
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    params.set('auto', 'format');
    
    return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
  }
  return url;
};