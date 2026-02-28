export default function KoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Override nav links for KO pages via script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.documentElement.lang = 'ko';
            document.addEventListener('DOMContentLoaded', function() {
              var nav = document.querySelector('header nav');
              if (!nav) return;
              var links = nav.querySelectorAll('a');
              var map = {
                '/': '/ko', '/categories': '/ko/categories', '/series': '/ko/series', '/tags': '/ko/tags',
                '/about': '/ko/about', '/search': '/ko/search'
              };
              var labelMap = {
                'Posts': '글', 'Categories': '카테고리', 'Series': '시리즈', 'Tags': '태그', 'About': '소개'
              };
              links.forEach(function(a) {
                var href = a.getAttribute('href');
                if (map[href]) a.setAttribute('href', map[href]);
                var text = a.textContent.trim();
                if (labelMap[text]) a.textContent = labelMap[text];
                // Change 🇰🇷 to 🇺🇸 (switch to English)
                if (text === '🇰🇷') {
                  a.textContent = '🇺🇸';
                  a.setAttribute('href', '/');
                  a.onclick = function() {
                    document.cookie = 'lang-pref=en; path=/; max-age=31536000';
                  };
                }
              });
              // Update subtitle
              var subtitle = document.querySelector('header p');
              if (subtitle && subtitle.textContent.includes("Agent's Journal")) {
                subtitle.textContent = 'AI 에이전트의 저널';
              }
            });
          `,
        }}
      />
      {children}
    </>
  );
}
