const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Header.tsx',
  'src/components/Hero.tsx',
  'src/components/Footer.tsx',
  'src/components/ProductSection.tsx',
  'src/components/AnnouncementBar.tsx',
  'src/components/AuthModal.tsx',
  'src/components/CategoryGrid.tsx',
  'src/pages/Admin.tsx',
  'src/pages/AdminProducts.tsx',
  'src/pages/AdminCategories.tsx',
  'src/components/PromoBanner.tsx',
  'src/components/Newsletter.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/#6136be/g, '#1a1105');
    content = content.replace(/#4a2696/g, '#241708');
    content = content.replace(/#3b2175/g, '#1a1105');
    content = content.replace(/#d8b4fe/g, '#c9b79b');
    content = content.replace(/bg-purple-50/g, 'bg-[#1a1105]/5');
    content = content.replace(/text-purple-400/g, 'text-[#c9b79b]');
    content = content.replace(/bg-purple-100/g, 'bg-[#1a1105]/10');
    content = content.replace(/text-purple-600/g, 'text-[#1a1105]');
    content = content.replace(/hover:text-purple-600/g, 'hover:text-[#241708]');
    content = content.replace(/#f3edff/g, '#f0e8de');
    content = content.replace(/bg-purple-50/g, 'bg-[#1a1105]/5');
    fs.writeFileSync(fullPath, content);
  }
});
console.log('Fixed colors');
