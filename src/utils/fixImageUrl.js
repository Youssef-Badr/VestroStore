export const fixImageUrl = (img) => {
  if (!img) return "";

  let url = typeof img === "string" ? img : img?.url;
  const publicId = typeof img === "object" ? img?.public_id : null;

  // 1. لو مفيش URL أصلاً، ابنيه من الـ public_id
  if (!url && publicId) {
    // تأكد إن الـ public_id ملوش بادئة مكررة
    return `https://res.cloudinary.com/dryibkglk/image/upload/${publicId}`;
  }

  if (!url) return "";

  // 2. حل مشكلة تكرار الدومين أو الـ base path لو موجود
  // أحياناً الرابط بيجي مكرر مرتين ورا بعض
  if (url.includes('https://res.cloudinary.com/') && url.lastIndexOf('https://') > 0) {
    url = url.substring(url.lastIndexOf('https://'));
  }

  // 3. تنظيف الامتدادات المكررة (png.png وغيرها)
  url = url.replace(/\.(png|jpg|jpeg|webp)(\.\1)+/gi, ".$1");

  // 4. حل مشكلة الـ Version (v1234567)
  // أحياناً الـ version اللي متخزن بيكون قديم أو غلط، لو الـ 404 مستمر جرب تشيله
  // url = url.replace(/\/v\d+\//, '/'); // سطر اختياري لو الـ version هو اللي بيبوظ الرابط

  // 5. تأكد من وجود الـ Folder الصحيح (لو الـ backend بيضيفه والـ URL بيضيفه تاني)
  // لو لقيت vestro-ecommerce-product مكررة مرتين نظفها هنا
  const folderName = "vestro-ecommerce-product";
  const folderPattern = new RegExp(`${folderName}/${folderName}`, 'g');
  url = url.replace(folderPattern, folderName);

  return url;
};